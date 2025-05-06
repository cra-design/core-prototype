// Generates the GCWeb/Jekyll page

    "use strict";

    let generatePage = async function generatePage(pageURIStr, jsonFilePath, layout, includeScripts, includeStyles) {
            const parser = new DOMParser();
            let altlangObj, breadcrumbLinks, cssLinks, styleElms, scriptElms, mainCode, headerElms, 
                yamlOutput = "", 
                styleData = "", 
                htmlOutput = "", 
                scriptData = "", 
                pageURI = new URL(pageURIStr), 
                absUrlRegEx = new RegExp("((?:<[a-z]+?\\s[^>]*?)(?:(?:href|src|cite|longdesc|action|formaction|poster|icon|manifest|srcset|data(?:-[a-z\\-]+)?)=['\"]))(\\/(?:[^\\/]{1}[^\'\"]+?))(?=['\"][^>]*?>)", "giv"),
                data = await $.get(pageURI)
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        // Handle error
                        console.log("Error: [likely cause - origin is blocked due to CORS policy: No 'Access-Control-Allow-Origin]");
                        return null; // Or handle the error and return a default value
                 }), 
//                regexLinkData = await $.get(jsonFilePath), 
                fileLinkArr = await $.get(jsonFilePath), 
//                fileLinkArr = JSON.parse(regexLinkData), 
                result = data.replace(absUrlRegEx, "$1" + pageURI.protocol + "//" + pageURI.hostname + "$2"), 
                pageObj = parser.parseFromString(result, "text/html"), 
                pageTemp = pageObj.cloneNode(true), 
                pageTitleObj = pageObj.querySelector("meta[name=dcterms\\.title]"), 
                pagelang = pageObj.getElementsByTagName("html")[0].lang, 
                breadCrumbObj = pageObj.getElementsByClassName("breadcrumb"), 
                pagedetailsEl = pageObj.getElementsByClassName("pagedetails"), 
                getMetaDataVal = function getMetaDataVal(pageObj, fieldname, metafield, addQuote) {
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
                removeElmChild = function clearObjChild(pageObj, tagName) {
                    const tagObj = pageObj.getElementsByTagName(tagName);

                    if (tagObj.length > 0) {
                        tagObj[0].innerHTML = "";
                    }
                }, 
                removeElmAttr = function removeElmAttr(pageObj, tagName) {
                    const tagObj = pageObj.getElementsByTagName(tagName);
                    let attributes;

                    if (tagObj.length > 0) {
                        attributes = Array.from(tagObj[0].attributes);
                        attributes.forEach(attr => tagObj[0].removeAttribute(attr.name));
                    }
                }, 
                removeElmSib = function removeSiblings(pageObj, tagName) {
                    const tagObj = pageObj.getElementsByTagName(tagName);
                    let children, 
                        parent = null;

                    if (tagObj.length > 0) {
                        parent = tagObj[0].parentNode;
                    }

                    if (parent !== null) {
                        children = Array.from(parent.children);
                        children.forEach(child => {
                            if (child !== tagObj[0]) {
                                child.remove();
                            }
                        });
                    }
                };

            if (data === null) {
                return yamlOutput;
            }
            // Adds layout
            if (layout !== "") {
                yamlOutput = yamlOutput + "layout: " + layout + "\n";
            }
            // Adds title
            if (pageTitleObj !== null && "content" in pageTitleObj === true) {
                yamlOutput = yamlOutput + "title: \"" + pageTitleObj.content.trim() + "\"\n";
            }
            // Adds description
            yamlOutput = yamlOutput + getMetaDataVal(pageObj, "description", "dcterms.description", true);
            // Adds subject
            yamlOutput = yamlOutput + getMetaDataVal(pageObj, "subject", "dcterms.subject", true);
            // Adds keywords
            yamlOutput = yamlOutput + getMetaDataVal(pageObj, "keywords", "keywords", true);
            if (pageObj.getElementById("wb-so") !== null) {
                yamlOutput = yamlOutput + "auth:\n  type: \"contextual\"\n  label: \"Sign in\"\n  labelExtended: \"CRA sign in\"\n  link: \"https://www.canada.ca/en/revenue-agency/services/e-services/cra-login-services.html\"\n";
            }
            // Adds alternate language link
            if (pagelang === "fr") {
                altlangObj = pageObj.querySelector("link[rel=alternate][hreflang=en]");
            } else if (pagelang === "en") {
                altlangObj = pageObj.querySelector("link[rel=alternate][hreflang=fr]");
            }
            if (altlangObj !== null && typeof altlangObj !== "undefined") {
                yamlOutput = yamlOutput + "altLangPage: \"" + altlangObj.href + "\"\n";
            }
            // Adds date modified
            yamlOutput = yamlOutput + getMetaDataVal(pageObj, "dateModified", "dcterms.modified", false);
            // Adds date issued
            yamlOutput = yamlOutput + getMetaDataVal(pageObj, "dateIssued", "dcterms.issued", false);
            // Adds breadcrumbs
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
            if (pageTemp.getElementsByTagName("main").length > 0) {
                pageTemp.getElementsByTagName("main")[0].remove();
            }
            // Adds links to CSS files
            cssLinks = pageTemp.querySelectorAll("link[rel=stylesheet]");
            for (let cssLink of cssLinks) {
                if (islinkInTemplate(fileLinkArr.stylsheetsRegEx, cssLink.href) === false) {
                    yamlOutput = yamlOutput + "css: \"" + cssLink.href + "\"\n";
                }
            }
            // Adds links to script files
            scriptElms = pageTemp.getElementsByTagName("script");
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
            if (pageTitleObj !== null && "content" in pageTitleObj === true) {
//                if (document.querySelector("[data-ajax-replace=/etc/designs/canada/wet-boew/assets/feedback/page-feedback-en.html]").length > 0) {
                yamlOutput = yamlOutput + "feedbackData:\n  section: \"" + pageTitleObj.content + "\"\n";
//                }
                // Adds originating URL as sourceurl
                yamlOutput = yamlOutput + "soureceurl:\n  - title: \"" + pageTitleObj.content.trim() + "\"\n    link: \"" + pageURI + "\"\n";
            }
            // Adds any <style> tags outside of the <main> tag and adds them to the bottom of the content
            if (includeStyles === true) {
                styleElms = pageTemp.getElementsByTagName("style");
                for (let styleElm of styleElms) {
                    styleData = styleData + styleElm.outerHTML + "\n";
                }
            }
            // Removes page details section 
            for (var i = pagedetailsEl.length - 1; i >= 0; i = i - 1) {
                pagedetailsEl[i].remove();
            }
            // Removes <h1> if layout is not "without-h1"
            mainCode = pageObj.getElementsByTagName("main");
            if (mainCode.length > 0) {
                if (layout !== "without-h1") {
                    headerElms = mainCode[0].getElementsByTagName("h1");
                    if (headerElms.length > 0 && headerElms[0].parentNode.tagName.toLowerCase() === "div" && headerElms[0].parentNode.children.length === 1) {
                        headerElms[0].parentNode.remove();
                    } else {
                        headerElms[0].remove();
                    }
                }
                removeElmAttr(pageObj, "html");
                removeElmAttr(pageObj, "head");
                removeElmChild(pageObj, "head");
                removeElmAttr(pageObj, "body");
                removeElmAttr(pageObj, "main");
                removeElmSib(pageObj, "main");
                htmlOutput = mainCode[0].innerHTML.trim() + "\n";
            }
            return { "yamlCode": yamlOutput, "htmlCode": htmlOutput, "cssCode": styleData, "scriptCode": scriptData};
        };
