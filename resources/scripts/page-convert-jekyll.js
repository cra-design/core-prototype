// Generates the GCWeb/Jekyll page

let outputPage = (function outputPage() {
    "use strict";

    return {
        "getPageObject": async function getPageObject(pageURIStr) {
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
        "getFileLinkList": async function getFileLinkList(jsonFilePath) {
           // let regexLinkData = await $.get(jsonFilePath), 
               // fileLinkArr = JSON.parse(regexLinkData);
            let fileLinkArr = await $.get(jsonFilePath);

            return  fileLinkArr;
        }, 
        "convert": function convert(pageObj, fileLinkArr, pageURIStr, pageLayout, includeScripts, includeStyles) {
            let pageTitleObj = pageObj.querySelector("meta[name=dcterms\\.title]"), 
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
                    let headerElms, 
                        cleanObj = mainPageObj.cloneNode(true), 
                        pagedetailsEl = cleanObj.getElementsByClassName("pagedetails");

                    // Removes page details section 
                    for (let i = pagedetailsEl.length - 1; i >= 0; i = i - 1) {
                        pagedetailsEl[i].remove();
                    }
                    // Removes <h1> if layout is not "without-h1"
                    if (pageLayout !== "without-h1") {
                        headerElms = cleanObj.getElementsByTagName("h1");
                        if (headerElms.length > 0 && headerElms[0].parentNode.tagName.toLowerCase() === "div" && headerElms[0].parentNode.children.length === 1) {
                            headerElms[0].parentNode.remove();
                        } else {
                            headerElms[0].remove();
                        }
                    }
                    return cleanObj;
                };


            if (pageObj === "") {
                return { "yamlCode": "", "htmlCode": "", "cssCode": "", "scriptCode": ""};
            } else {
            return {
                "layout": function layout() {
                    // Adds layout
                    if (pageLayout !== "") {
                        return "layout: " + pageLayout + "\n";
                    }
                    return "";
                }, 
                "title": function title() {
                    // Adds title
                    if (pageTitleObj !== null && "content" in pageTitleObj === true) {
                        return "title: \"" + pageTitleObj.content.trim() + "\"\n";
                    }
                    return "";
                }, 
                "description": function description() {
                    // Adds description
                    return getMetaDataContent(pageObj, "description", "dcterms.description", true);
                }, 
                "subject": function subject() {
                    // Adds subject
                    return getMetaDataContent(pageObj, "subject", "dcterms.subject", true);
                }, 
                "keywords": function keywords() {
                    // Adds keywords
                    return getMetaDataContent(pageObj, "keywords", "keywords", true);
                }, 
                "login": function login() {
                    // generates CRA sign in button
                    if (pageObj.getElementById("wb-so") !== null) {
                        return "auth:\n  type: \"contextual\"\n  label: \"Sign in\"\n  labelExtended: \"CRA sign in\"\n  link: \"https://www.canada.ca/en/revenue-agency/services/e-services/cra-login-services.html\"\n";
                    }
                    return "";
                }, 
                "altlangpage": function altlangpage() {
                    // Adds alternate language link
                    let altlangObj, 
                        pagelang = pageObj.getElementsByTagName("html")[0].lang;

                    if (pagelang === "fr") {
                        altlangObj = pageObj.querySelector("link[rel=alternate][hreflang=en]");
                    } else if (pagelang === "en") {
                        altlangObj = pageObj.querySelector("link[rel=alternate][hreflang=fr]");
                    }
                    if (altlangObj !== null && typeof altlangObj !== "undefined") {
                        return "altLangPage: \"" + altlangObj.href + "\"\n";
                    }
                    return "";
                }, 
                "datemodified": function datemodified() {
                    // Adds date modified
                    return getMetaDataContent(pageObj, "dateModified", "dcterms.modified", false);
                }, 
                "dateissued": function dateissued() {
                    // Adds date issued
                    return getMetaDataContent(pageObj, "dateIssued", "dcterms.issued", false);
                }, 
                "breadcrumbs": function breadcrumbs() {
                    // Adds breadcrumbs
                    let breadcrumbLinks, 
                        breadcrumbOutput = "", 
                        breadCrumbObj = pageObj.getElementsByClassName("breadcrumb");

                    if (typeof breadCrumbObj !== "undefined" && breadCrumbObj.length > 0) {
                        breadcrumbLinks = breadCrumbObj[0].querySelectorAll("a");
                        if (breadcrumbLinks.length > 1) {
                            breadcrumbOutput = "breadcrumbs: # By default the Canada.ca crumbs is already set\n";
                            breadcrumbLinks.forEach(function addBreadCrumb(breadLink) {
                                if (breadLink.textContent.toLowerCase() === "canada.ca") {
                                    return;
                                }
                                breadcrumbOutput = breadcrumbOutput + "  - title: \"" + breadLink.textContent.trim() + "\"\n    link: \"" + breadLink.href + "\"\n";
                            });
                        }
                    }
                    return breadcrumbOutput;
                }, 
                "css": function css() {
                    // Adds links to CSS files
                    let cssLinks, 
                        cssOutput = "", 
                        noMainPageObj = pageObj.cloneNode(true);


                    if (noMainPageObj.getElementsByTagName("main").length > 0) {
                        noMainPageObj.getElementsByTagName("main")[0].remove();
                    }
                    cssLinks = noMainPageObj.querySelectorAll("link[rel=stylesheet]");
                    for (let cssLink of cssLinks) {
                        if (islinkInTemplate(fileLinkArr.stylsheetsRegEx, cssLink.href) === false) {
                            cssOutput = cssOutput + "css: \"" + cssLink.href + "\"\n";
                        }
                    }
                    return cssOutput;
                }, 
                "script": function script() {
                    // Adds links to script files
                    let scriptElms, 
                        scriptData = "", 
                        scriptOutput = "", 
                        noMainPageObj = pageObj.cloneNode(true);

                    if (noMainPageObj.getElementsByTagName("main").length > 0) {
                        noMainPageObj.getElementsByTagName("main")[0].remove();
                    }
                    scriptElms = noMainPageObj.getElementsByTagName("script");
                    for (let scriptElm of scriptElms) {
                        if (scriptElm.innerHTML !== "") {
                            // Gets any <script> tags outside of the <main> tag and adds them to the bottom of the content
                            if (includeScripts === true) {
                                scriptData = scriptData + scriptElm.outerHTML + "\n";
                            }
                        } else if (islinkInTemplate(fileLinkArr.scriptsRegEx, scriptElm.src) === false) {
                            scriptOutput = scriptOutput + "script: \"" + scriptElm.src + "\"\n";
                        }
                    }
                    return {
                        "value": scriptOutput, 
                        "inline": scriptData
                    };
                }, 
                "feedbackdata": function feedbackdata() {
                    // Sets feedback box
                    if (pageTitleObj !== null && "content" in pageTitleObj === true) {
                        return "feedbackData:\n  section: \"" + pageTitleObj.content + "\"\n";
                    }
                    return "";
                }, 
                "sourceurl": function soureceurl() {
                    // Adds originating URL as sourceurl
                    if (pageTitleObj !== null && "content" in pageTitleObj === true) {
                        return "soureceurl:\n  - title: \"" + pageTitleObj.content.trim() + "\"\n    link: \"" + pageURIStr + "\"\n";
                    }
                    return "";
                }, 
                "style": function style() {
                    // Adds any <style> tags outside of the <main> tag and adds them to the bottom of the content
                    let styleElms, 
                        styleOutput = "", 
                        noMainPageObj = pageObj.cloneNode(true);
 
                    if (includeStyles === true) {
                        if (noMainPageObj.getElementsByTagName("main").length > 0) {
                            noMainPageObj.getElementsByTagName("main")[0].remove();
                        }
                        styleElms = noMainPageObj.getElementsByTagName("style");
                        for (let styleElm of styleElms) {
                            styleOutput = styleOutput + styleElm.outerHTML + "\n";
                        }
                    }
                    return styleOutput;
                }, 
                "yaml": function yaml() {
                    return "".concat(this.layout(), this.title(), this.description(), this.subject(), this.keywords(), this.login(), this.altlangpage(), this.datemodified(), this.dateissued(), this.breadcrumbs(), this.css(), this.script().value, this.feedbackdata(), this.sourceurl());
                }, 
                "pagedata": function pagedata() {
                    return {
                        "yamlCode": this.yaml(), 
                        "htmlCode": this.html(), 
                        "cssCode": this.style(), 
                        "scriptCode": this.script().inline
                    };
                }, 
                "htmldoc": function htmldoc() {
                    let mainPageObj = pageObj.cloneNode(true), 
                        mainCode = mainPageObj.getElementsByTagName("main");

                    if (mainCode.length > 0) {
                        return cleanMain(mainCode[0], pageLayout);
                    }
                    return mainPageObj;
                }, 
                "html": function html() {
                    let mainCodeObj, 
                        mainPageObj = pageObj.cloneNode(true), 
                        mainCode = mainPageObj.getElementsByTagName("main");

                    if (mainCode.length > 0) {
                        mainCodeObj = cleanMain(mainCode[0], pageLayout);
                        return mainCodeObj.innerHTML.trim() + "\n";
                    }
                    return mainPageObj.documentElement.innerHTML.trim();
                }
            };
        }

        }
    };
}());
