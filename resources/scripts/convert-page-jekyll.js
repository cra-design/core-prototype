// Generates the GCWeb/Jekyll page

    "use strict";

    let getPageObject = async function getPageObject(pageURIStr) {
        const parser = new DOMParser();
        let pageURI = new URL(pageURIStr), 
            data = await $.get(pageURI)
                .fail(function (jqXHR, textStatus, errorThrown) {
                    // Handle error
                    console.log("Error: [likely cause - origin is blocked due to CORS policy: No 'Access-Control-Allow-Origin]");
                    return null; // Or handle the error and return a default value
                }), 
            absUrlRegEx = new RegExp("((?:<[a-z]+?\\s[^>]*?)(?:(?:href|src|cite|longdesc|action|formaction|poster|icon|manifest|srcset|data(?:-[a-z\\-]+)?)=['\"]))(\\/(?:[^\\/]{1}[^\'\"]+?))(?=['\"][^>]*?>)", "giv"),
            result = data.replace(absUrlRegEx, "$1" + pageURI.protocol + "//" + pageURI.hostname + "$2");
            if (data === null) {
                return "";
            }
            return parser.parseFromString(result, "text/html");
        }, 
        getFileLinkList = async function getFileLinkList(jsonFilePath) {
           // let regexLinkData = await $.get(jsonFilePath), 
            let fileLinkArr = await $.get(jsonFilePath);
               // fileLinkArr = JSON.parse(regexLinkData);

                return  fileLinkArr;
        }, 
        convert = function convert(pageObj, fileLinkArr, pageURIStr, pageLayout, includeScripts, includeStyles) {
            let pagelang, altlangObj, breadCrumbObj, breadcrumbLinks, cssLinks, styleElms, scriptElms, 
                yamlOutput = "", 
                styleData = "", 
                scriptData = "", 
                pageTitleObj = pageObj.querySelector("meta[name=dcterms\\.title]"), 
                noMainPageObj = pageObj.cloneNode(true), 
                getMetaDataContent = function getMetaDataContent(pageObj, fieldname, metafield, addQuote) {
                    // Add a Metadata value as a string
                    let encloseQuote = "", 
                        metaEl = pageObj.getElementsByName(metafield);

                    if (addQuote === true) {
                        encloseQuote = "\"";
                    }
                    if (metaEl !== null && metaEl.length > 0 && "content" in metaEl[0] === true) {
                        return fieldname + ": " + encloseQuote + metaEl[0].content.trim() + encloseQuote + "\n";
                    }
                    return "";
                },
                islinkInTemplate = function islinkInTemplate(linkArr, checkURL) {
                    // Checks if the <script> or <link> css file is in the JSON file to be ignored from adding to the page 
                    return linkArr.some(function (linkStr) {
                        let linkRegEx = new RegExp(linkStr, "iv");
                        return linkRegEx.test(decodeURIComponent(checkURL.trim()).toLowerCase());
                    }, checkURL);
                }, 
                cleanMain = function cleanMain(mainPageObj, pageLayout) {
                    let mainCode, headerElms, 
                        cleanObj = mainPageObj.cloneNode(true), 
                        pagedetailsEl = cleanObj.getElementsByClassName("pagedetails");

                    // Removes page details section 
                    for (let i = pagedetailsEl.length - 1; i >= 0; i = i - 1) {
                        pagedetailsEl[i].remove();
                    }
                    // Removes <h1> if layout is not "without-h1"
                    mainCode = cleanObj.getElementsByTagName("main");
                    if (mainCode.length > 0) {
                        if (pageLayout !== "without-h1") {
                            headerElms = mainCode[0].getElementsByTagName("h1");
                            if (headerElms.length > 0 && headerElms[0].parentNode.tagName.toLowerCase() === "div" && headerElms[0].parentNode.children.length === 1) {
                                headerElms[0].parentNode.remove();
                            } else {
                                headerElms[0].remove();
                            }
                        }
                        return mainCode[0].outerHTML.trim();
                    }
                    return cleanObj.outerHTML.trim();
                };

            if (noMainPageObj.getElementsByTagName("main").length > 0) {
                noMainPageObj.getElementsByTagName("main")[0].remove();
            }
            // Adds layout
            if (pageLayout !== "") {
                yamlOutput = yamlOutput + "layout: " + pageLayout + "\n";
            }
            // Adds title
            if (pageTitleObj !== null && "content" in pageTitleObj === true) {
                yamlOutput = yamlOutput + "title: \"" + pageTitleObj.content.trim() + "\"\n";
            }
            // Adds description
            yamlOutput = yamlOutput + getMetaDataContent(pageObj, "description", "dcterms.description", true);
            // Adds subject
            yamlOutput = yamlOutput + getMetaDataContent(pageObj, "subject", "dcterms.subject", true);
            // Adds keywords
            yamlOutput = yamlOutput + getMetaDataContent(pageObj, "keywords", "keywords", true);
            // generates CRA sign in button
            if (pageObj.getElementById("wb-so") !== null) {
                yamlOutput = yamlOutput + "auth:\n  type: \"contextual\"\n  label: \"Sign in\"\n  labelExtended: \"CRA sign in\"\n  link: \"https://www.canada.ca/en/revenue-agency/services/e-services/cra-login-services.html\"\n";
            }
            // Adds alternate language link
            pagelang = pageObj.getElementsByTagName("html")[0].lang;
            if (pagelang === "fr") {
                altlangObj = pageObj.querySelector("link[rel=alternate][hreflang=en]");
            } else if (pagelang === "en") {
                altlangObj = pageObj.querySelector("link[rel=alternate][hreflang=fr]");
            }
            if (altlangObj !== null && typeof altlangObj !== "undefined") {
                yamlOutput = yamlOutput + "altLangPage: \"" + altlangObj.href + "\"\n";
            }
            // Adds date modified
            yamlOutput = yamlOutput + getMetaDataContent(pageObj, "dateModified", "dcterms.modified", false);
            // Adds date issued
            yamlOutput = yamlOutput + getMetaDataContent(pageObj, "dateIssued", "dcterms.issued", false);
            // Adds breadcrumbs
            breadCrumbObj = pageObj.getElementsByClassName("breadcrumb");
            if (typeof breadCrumbObj !== "undefined" && breadCrumbObj.length > 0) {
                breadcrumbLinks = breadCrumbObj[0].querySelectorAll("a");
                if (breadcrumbLinks.length > 1) {
                    yamlOutput = yamlOutput + "breadcrumbs: # By default the Canada.ca crumbs is already set\n";
                    breadcrumbLinks.forEach(function addBreadCrumb(breadLink) {
                        if (breadLink.textContent.toLowerCase() === "canada.ca") {
                            return;
                        }
                        yamlOutput = yamlOutput + "  - title: \"" + breadLink.textContent.trim() + "\"\n    link: \"" + breadLink.href + "\"\n";
                    });
                }
            }
            // Adds links to CSS files
            cssLinks = noMainPageObj.querySelectorAll("link[rel=stylesheet]");
            for (let cssLink of cssLinks) {
                if (islinkInTemplate(fileLinkArr.stylsheetsRegEx, cssLink.href) === false) {
                    yamlOutput = yamlOutput + "css: \"" + cssLink.href + "\"\n";
                }
            }
            // Adds links to script files
            scriptElms = noMainPageObj.getElementsByTagName("script");
            for (let scriptElm of scriptElms) {
                if (scriptElm.innerHTML !== "") {
                    // Gets any <script> tags outside of the <main> tag and adds them to the bottom of the content
                    if (includeScripts === true) {
                        scriptData = scriptData + scriptElm.outerHTML + "\n";
                    }
                } else if (islinkInTemplate(fileLinkArr.scriptsRegEx, scriptElm.src) === false) {
                    yamlOutput = yamlOutput + "script: \"" + scriptElm.src + "\"\n";
                }
            }
            // Sets feedback box
            if (pageTitleObj !== null && "content" in pageTitleObj === true) {
//                if (document.querySelector("[data-ajax-replace=/etc/designs/canada/wet-boew/assets/feedback/page-feedback-en.html]").length > 0) {
                yamlOutput = yamlOutput + "feedbackData:\n  section: \"" + pageTitleObj.content + "\"\n";
//                }
                // Adds originating URL as sourceurl
                if (pageTitleObj !== null && "content" in pageTitleObj === true) {
                    yamlOutput = yamlOutput + "soureceurl:\n  - title: \"" + pageTitleObj.content.trim() + "\"\n    link: \"" + pageURIStr + "\"\n";
                }
            }
            // Adds any <style> tags outside of the <main> tag and adds them to the bottom of the content
            if (includeStyles === true) {
                styleElms = noMainPageObj.getElementsByTagName("style");
                for (let styleElm of styleElms) {
                    styleData = styleData + styleElm.outerHTML + "\n";
                }
            }
            return { "yamlCode": yamlOutput, "htmlCode": cleanMain(pageObj, pageLayout), "cssCode": styleData, "scriptCode": scriptData};
        };
