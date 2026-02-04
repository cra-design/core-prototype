// Generates the GCWeb/Jekyll page

let outputPage = (function outputPage() {
    "use strict";
    let jsonFilePath = "/core-prototype/resources/tools/jekyll-converter/data/template-links.json";

    return {
        "getPageObject": async function getPageObject(pageURIStr) {
            const parser = new DOMParser();
            let pageURI, data, result, 
                absUrlRegEx = new RegExp("((?:<[a-z]+?\\s[^>]*?)(?:(?:href|src|cite|longdesc|action|formaction|poster|icon|manifest|srcset|data(?:-[a-z\\-]+)?)=['\"]))(\\/(?:[^\\/]{1}[^'\"]+?))(?=['\"][^>]*?>)", "giv");

            if (pageURIStr !== "") {
                pageURI = new URL(pageURIStr);
                try {
                    data = await $.get(pageURI).fail(function (jqXHR, textStatus, errorThrown) {
                        // Handle error
                        console.error("Error: [likely cause - origin is blocked due to CORS policy: No 'Access-Control-Allow-Origin]");
                    });
                    if (data === null) {
                        return null;
                    }
                    result = data.replace(absUrlRegEx, "$1" + pageURI.protocol + "//" + pageURI.hostname + "$2");
                    return parser.parseFromString(result, "text/html");
                } catch (error) {
                    // Handle the error here
                    console.error("Failed to fetch data");
                    return null; // Or handle the error and return a default value
                }
            }
            return null;
        }, 
        "getFileLinkList": async function getFileLinkList(jsonFilePath) {
            // let regexLinkData = await $.get(jsonFilePath), 
            // fileLinkArr = JSON.parse(regexLinkData);
            let fileLinkArr = await $.get(jsonFilePath);

            return fileLinkArr;
        }, 
        "formatOutputType": function (templateType, frontMatterType, yamlOutput, jsonOutput) {
            switch (frontMatterType) {
                case "yaml":
                    if (templateType === "") {
                        return yamlOutput;
                    } else {
                        return jsonOutput;
                    }
                case "json":
                    return jsonOutput;
                default:
                    return "";
            }
        }, 
        "convert": async function convert(pageLayout, templateType, frontMatterType, pageURIStr, notedPagesJSONStr, includeStyles, includeScripts, removeMWSdivs) {
            const isYAML = "yaml";

            let pageTitleObj, 
                pageObj = await this.getPageObject(pageURIStr), 
                fileLinkArr = await this.getFileLinkList(jsonFilePath), 
                getMetaDataContent = function getMetaDataContent(pageObj, fieldname, metafield, addQuote) {
                    // Add a Metadata value as a string
                    let encloseQuote = "", 
                        metaEl = pageObj.getElementsByName(metafield);

                    if (addQuote === true) {
                        encloseQuote = "\"";
                    }
                    if (metaEl !== null && metaEl.length > 0 && "content" in metaEl[0] === true) {
                        return outputPage().formatOutputType(templateType, frontMatterType, fieldname + ": " + encloseQuote + metaEl[0].content.trim() + encloseQuote + "\n", "\"" + fieldname + "\": \"" + metaEl[0].content.trim() + "\"");
                    }
                    return "";
                }, 
                islinkInTemplate = function islinkInTemplate(linkArr, checkURL, regExFlag, isDecoded) {
                    // Checks if the <script> or <link> css file is in the JSON file to be ignored from adding to the page
                    return linkArr.some(function (linkStr) {
                        let linkRegEx = new RegExp(linkStr, regExFlag);
                        if (isDecoded === true) {
                            return linkRegEx.test(decodeURIComponent(checkURL.trim()).toLowerCase());
                        } else {
                            return linkRegEx.test(checkURL.trim().toLowerCase());
                        }
                    }, checkURL);
                }, 
                cleanMain = function cleanMain(mainPageObj, pageLayout) {
                    let i, headerElms, mwsElms, 
                        cleanObj = mainPageObj.cloneNode(true), 
                        pagedetailsEl = cleanObj.getElementsByClassName("pagedetails");

                    // Removes page details section
                    for (i = pagedetailsEl.length - 1; i >= 0; i = i - 1) {
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

                    // If option selected removes Managed Web Service (MWS) class parent DIVs 
                    if (removeMWSdivs === true) {
                        mwsElms = cleanObj.querySelectorAll("div.mwsaccordion-html, div.mwsadaptiveimage, div.mwsalerts, div.mwsblockquote, div.mwsbodytext, div.mwsbuttons, div.mwscalendar-html, div.mwscarousel, div.mwschart-hf, div.mwschildnodetable, div.mwscolumns, div.mwscorporateinformation, div.mwsdoormat-links, div.mwsdoormat-links-container, div.mwsfeatureimage, div.mwsfollowus, div.mwsform-html, div.mwsfootnotes-html, div.mwsgeomap, div.mwsgeneric-base-html, div.mwshorizontalrule, div.mwsinpagetoc, div.mwslatestnews, div.mwslink-box, div.mwsmediaplayer, div.mwsmulti-list, div.mwspagination, div.mwspanel, div.mwsportfolioministers, div.mwsstepbysteptoc, div.mwstabbed-interface-html, div.mwstemplate-html, div.mwstext, div.mwstitle, div.mwswhatdoing-html, div.advancedlist, div.contentfragment, div.contentfragmentlist");
                        mwsElms.forEach(function removeParentNode(parentElm) {
                            parentElm.replaceWith(...parentElm.childNodes);
                        });
                    }
                    return cleanObj;
                };

            if (pageObj === null || pageObj === "") {
                return {"cssCode": "", "fmCode": "", "htmlCode": "", "scriptCode": ""};
            } else {
                pageTitleObj = pageObj.querySelector("meta[name=dcterms\\.title]");
                return {
                    "layout": function layout() {
                        let mainCode = pageObj.getElementsByTagName("main")[0];

                        // Adds layout
                        if (templateType === "") {
                            if (pageLayout !== "") {
                                return outputPage().formatOutputType(templateType, frontMatterType, "layout: " + pageLayout + "\n", "\"layout\": \"" + pageLayout + "\"");
                            }
                        } else if (mainCode.classList.contains("container") === true) {
                            return "\"layout\": \"without-h1\"";
                        }
                        return "";
                    }, 
                    "title": function title() {
                        // Adds title
                        if (pageTitleObj !== null && "content" in pageTitleObj === true) {
                            return outputPage().formatOutputType(templateType, frontMatterType, "title: \"" + pageTitleObj.content.trim() + "\"\n", "\"title\": \"" + pageTitleObj.content.trim() + "\"");
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
                    "auth": function auth() {
                        // generates CRA sign in button
                        if (pageObj.getElementById("wb-so") !== null) {
                            return outputPage().formatOutputType(templateType, frontMatterType, "auth:\n  type: \"contextual\"\n  label: \"Sign in\"\n  labelExtended: \"CRA sign in\"\n  link: \"https://www.canada.ca/en/revenue-agency/services/e-services/cra-login-services.html\"\n", "\"auth\": {\n\"type\": \"contextual\", \n\"label\": \"Sign in\", \n\"labelExtended\": \"CRA sign in\", \n\"link\": \"https://www.canada.ca/en/revenue-agency/services/e-services/cra-login-services.html\"\n}");
                        }
                        return "";
                    }, 
                    "altLangPage": function altLangPage() {
                        // Adds alternate language link
                        let altlangObj, 
                            pagelang = pageObj.getElementsByTagName("html")[0].lang;

                        if (pagelang === "fr") {
                            altlangObj = pageObj.querySelector("link[rel=alternate][hreflang=en]");
                        } else if (pagelang === "en") {
                            altlangObj = pageObj.querySelector("link[rel=alternate][hreflang=fr]");
                        }
                        if (altlangObj !== null && typeof altlangObj !== "undefined") {
                            return outputPage().formatOutputType(templateType, frontMatterType, "altLangPage: \"" + altlangObj.href + "\"\n", "\"altLangPage\": \"" + altlangObj.href + "\"");
                        }
                        return "";
                    }, 
                    "dateModified": function dateModified() {
                        // Adds date modified
                        return getMetaDataContent(pageObj, "dateModified", "dcterms.modified", false);
                    }, 
                    "dateIssued": function dateIssued() {
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
                                breadcrumbOutput = outputPage().formatOutputType(templateType, frontMatterType, "breadcrumbs: # By default the Canada.ca crumbs is already set\n", "\"breadcrumbs\": [");
                                breadcrumbLinks.forEach(function addBreadCrumb(breadLink) {
                                    if (breadLink.textContent.toLowerCase() === "canada.ca") {
                                        return;
                                    }
                                    if (frontMatterType === isYAML && templateType === "") {
                                        breadcrumbOutput += "  - title: \"" + breadLink.textContent.trim() + "\"\n    link: \"" + breadLink.href + "\"\n";
                                    } else {
                                        if (breadcrumbOutput.length > 17) {
                                            breadcrumbOutput += ", ";
                                        }
                                        breadcrumbOutput += "\n{\n\"title\": \"" + breadLink.textContent.trim() + "\", \n\"link\": \"" + breadLink.href + "\"\n}";
                                    }
                                });
                            }
                        }
                        if (breadcrumbOutput === "" || (frontMatterType === isYAML && templateType === "")) {
                            return breadcrumbOutput;
                        } else {
                            return breadcrumbOutput + "\n]";
                        }
                    }, 
                    "pageClass": function pageClass() {
                        let bodyClass = pageObj.body.classList;

                        if (bodyClass.length > 0) {
                            return outputPage().formatOutputType(templateType, frontMatterType, "pageClass: \"" + bodyClass.toString() + "\"\n", "\"pageClass\": \"" + bodyClass.toString() + "\"");
                        }
                    }, 
                    "css": function css() {
                        // Adds links to CSS files
                        let cssLink, cssLinks, 
                            cssOutput = "", 
                            noMainPageObj = pageObj.cloneNode(true);

                        if (noMainPageObj.getElementsByTagName("main").length > 0) {
                            noMainPageObj.getElementsByTagName("main")[0].remove();
                        }
                        cssLinks = noMainPageObj.querySelectorAll("link[rel=stylesheet]");
                        for (cssLink of cssLinks) {
                            if (islinkInTemplate(fileLinkArr.stylsheetsRegEx, cssLink.href, "iv", true) === false) {
                                if (frontMatterType === isYAML && templateType === "") {
                                    cssOutput += "css: \"" + cssLink.href + "\"\n";
                                } else {
                                    if (cssOutput === "") {
                                        cssOutput = "\"css\": [\n";
                                    } else {
                                        cssOutput += ", ";
                                    }
                                    cssOutput += "\"" + cssLink.href + "\"\n";
                                }
                            }
                        }
                        if (cssOutput === "" || (frontMatterType === isYAML && templateType === "")) {
                            return cssOutput;
                        } else {
                            return cssOutput + "]";
                        }
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
                                if (includeScripts === true && islinkInTemplate(fileLinkArr.inlineScript, scriptElm.textContent.replace(/[\r\n\s]+/g, "").toLowerCase(), "iv", false) === false) {
                                    scriptData += scriptElm.outerHTML + "\n";
                                }
                            } else if (islinkInTemplate(fileLinkArr.scriptsRegEx, scriptElm.src, "iv", true) === false) {
                                if (frontMatterType === isYAML && templateType === "") {
                                    scriptOutput += "script: \"" + scriptElm.src + "\"\n";
                                } else {
                                    if (scriptOutput === "") {
                                        scriptOutput = "\"script\": [\n";
                                    } else {
                                        scriptOutput += ", ";
                                    }
                                    scriptOutput += "\"" + scriptElm.src + "\"\n";
                                }
                            }
                        }
                        if (scriptOutput === "" || (frontMatterType === isYAML && templateType === "")) {
                            return {
                                "value": scriptOutput, 
                                "inline": scriptData
                            };
                        } else {
                            return {
                                "value": scriptOutput + "]", 
                                "inline": scriptData
                            };
                        }
                    }, 
                    "feedbackData": function feedbackData() {
                        // Sets feedback box
                        if (pageTitleObj !== null && "content" in pageTitleObj === true) {
                            return outputPage().formatOutputType(templateType, frontMatterType, "feedbackData:\n  section: \"" + pageTitleObj.content + "\"\n", "\"feedbackData\": {\n\"section\": \"" + pageTitleObj.content + "\"\n}");
                        }
                        return "";
                    }, 
                    "notedlinks": function notedlinks() {
                        // Adds URLs as noted page links
                        let notedPageArr, linkVal, 
                            linkRef = "", 
                            createNoteLink = function createNoteLink(refURIStr, linkText) {
                                let pageURI;

                                try {
                                    pageURI = new URL(refURIStr);
                                    return outputPage().formatOutputType(templateType, frontMatterType, "\n  - title: \"" + linkText + "\"\n    link: \"" + pageURI.origin + pageURI.pathname + "\"", "\n{\n\"title\": \"" + linkText + "\", \n\"link\": \"" + pageURI.origin + pageURI.pathname + "\"\n}");
                                } catch (e) {
                                    console.error("Invalid noted link URL");
                                    return null;
                                }
                            }, 
                            getJSONArr = function getJSONArr(jsonStr) {
                                let arr;

                                if (jsonStr !== "") {
                                    try {
                                        arr = JSON.parse(decodeURIComponent(jsonStr));
                                        return arr;
                                    } catch (e) {
                                        return null;
                                    }
                                }
                                return null;
                            };

                        if (pageTitleObj !== null && "content" in pageTitleObj === true) {
                            linkRef = createNoteLink(pageURIStr, pageTitleObj.content.trim());
                        }
                        notedPageArr = getJSONArr(notedPagesJSONStr);
                        if (notedPageArr !== null) {
                            notedPageArr.forEach(function addNotedPage(notedPage) {
                                if ("link" in notedPage && "title" in notedPage) {
                                    linkVal = createNoteLink(notedPage.link, notedPage.title);
                                    if (linkVal !== null) {
                                        if (linkRef !== "" && (frontMatterType !== isYAML || templateType !== "")) {
                                            linkRef += ", ";
                                        }
                                        linkRef += linkVal;
                                    }
                                }
                            });
                        }
                        if (linkRef !== "") {
                            return outputPage().formatOutputType(templateType, frontMatterType, "notedlinks:" + linkRef + "\n", "\"notedlinks\": [" + linkRef + "\n]");
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
                                styleOutput += styleElm.outerHTML + "\n";
                            }
                        }
                        return styleOutput;
                    }, 
                    "frontmatter": function frontmatter() {
                        let outputData = [this.layout(), this.title(), this.description(), this.subject(), this.keywords(), this.auth(), this.altLangPage(), this.dateModified(), this.dateIssued(), this.breadcrumbs(), this.pageClass(), this.css(), this.script().value, this.feedbackData(), this.notedlinks()], 
                            fmData = outputPage().formatOutputType(templateType, frontMatterType, outputData.join(""), "{\n" + outputData.filter(Boolean).join(", \n") + "\n}\n");

                        if (templateType === "") {
                            return fmData;
                        } else {
                            return JSON.parse(fmData);
                        }
                    }, 
                    "pagedata": function pagedata() {
                        return {
                            "cssCode": this.style(), 
                            "fmCode": this.frontmatter(), 
                            "htmlCode": this.html(), 
                            "scriptCode": this.script().inline
                        };
                    }, 
                    "pagecode": function pagecode() {
                        return outputPage().formatOutputType(templateType, frontMatterType, "---\n" + this.frontmatter() + "---\n\n" + this.style() + this.html(), "---\n{\n" + this.frontmatter() + "\n}\n---\n\n" + this.style() + this.html());
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
                            if (templateType === "") {
                                mainCodeObj = cleanMain(mainCode[0], pageLayout);
                            } else {
                                mainCodeObj = cleanMain(mainCode[0], "without-h1");
                            }
                            return mainCodeObj.innerHTML.trim() + "\n";
                        }
                        return mainPageObj.documentElement.innerHTML.trim();
                    }
                };
            }
        }
    };
})();

export default outputPage;