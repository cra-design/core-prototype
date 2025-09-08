// Generates the GCWeb/Jekyll page

let jsonFilePath = "https://cra-design.github.io/core-prototype/resources/tools/jekyll-converter/data/template-links.json", 
    outputPage = (function outputPage() {
    "use strict";

    return {
        "getPageObject": async function getPageObject(pageURIStr) {
            const parser = new DOMParser();
            let pageURI, data, result, 
                absUrlRegEx = new RegExp("((?:<[a-z]+?\\s[^>]*?)(?:(?:href|src|cite|longdesc|action|formaction|poster|icon|manifest|srcset|data(?:-[a-z\\-]+)?)=['\"]))(\\/(?:[^\\/]{1}[^\'\"]+?))(?=['\"][^>]*?>)", "giv");

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
        formatOutputType = function (frontMatterType, yamlOutput, jsonOutput) {
            switch (frontMatterType) {
                case "yaml":
                    return yamlOutput;
                case "json":
                    return jsonOutput;
                default:
                    return "";
            }
        }, 
        "convert": async function convert(pageLayout, frontMatterType, pageURIStr, notedPagesJSONStr, includeStyles, includeScripts, removeMWSdivs) {
            const isYAML = "yaml";

            let pageObj = await this.getPageObject(pageURIStr), 
                fileLinkArr = await this.getFileLinkList(jsonFilePath), 
                pageTitleObj = pageObj.querySelector("meta[name=dcterms\\.title]"), 
                getMetaDataContent = function getMetaDataContent(pageObj, fieldname, metafield, addQuote) {
                    // Add a Metadata value as a string
                    let encloseQuote = "", 
                        metaEl = pageObj.getElementsByName(metafield);

                    if (addQuote === true) {
                        encloseQuote = "\"";
                    }
                    if (metaEl !== null && metaEl.length > 0 && "content" in metaEl[0] === true) {
                        return this.formatOutputType(frontMatterType, fieldname + ": " + encloseQuote + metaEl[0].content.trim() + encloseQuote + "\n", "\"" + fieldname + "\": \"" + metaEl[0].content.trim() + "\"");
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
                    let headerElms, mwsElms, 
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
                return { "fmCode": "", "htmlCode": "", "cssCode": "", "scriptCode": ""};
            } else {
                return {
                    "layout": function layout() {
                        // Adds layout
                        if (pageLayout !== "") {
                            return this.formatOutputType(frontMatterType, "layout: " + pageLayout + "\n", "\"layout\": \"" + pageLayout + "\"");
                        }
                        return "";
                    }, 
                    "title": function title() {
                        // Adds title
                        if (pageTitleObj !== null && "content" in pageTitleObj === true) {
                            return this.formatOutputType(frontMatterType, "title: \"" + pageTitleObj.content.trim() + "\"\n",  "\"title\": \"" + pageTitleObj.content.trim() + "\"");
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
                            return this.formatOutputType(frontMatterType, "auth:\n  type: \"contextual\"\n  label: \"Sign in\"\n  labelExtended: \"CRA sign in\"\n  link: \"https://www.canada.ca/en/revenue-agency/services/e-services/cra-login-services.html\"\n", "\"auth\": [\n\"type\": \"contextual\", \n\"label\": \"Sign in\", \n\"labelExtended\": \"CRA sign in\", \n\"link\": \"https://www.canada.ca/en/revenue-agency/services/e-services/cra-login-services.html\"\n]");
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
                            return this.formatOutputType(frontMatterType, "altLangPage: \"" + altlangObj.href + "\"\n", "\"altLangPage\": \"" + altlangObj.href + "\"");
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
                                breadcrumbOutput = this.formatOutputType(frontMatterType, "breadcrumbs: # By default the Canada.ca crumbs is already set\n", "\"breadcrumbs\": [");
                                breadcrumbLinks.forEach(function addBreadCrumb(breadLink) {
                                    if (breadLink.textContent.toLowerCase() === "canada.ca") {
                                        return;
                                    }
                                    if (frontMatterType === isYAML) {
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
                        if (breadcrumbOutput === "" || frontMatterType === isYAML) {
                            return breadcrumbOutput;
                        } else {
                            return breadcrumbOutput + "\n]";
                        }
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
                                if (frontMatterType === isYAML) {
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
                        if (cssOutput === "" || frontMatterType === isYAML) {
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
                                if (includeScripts === true) {
                                    scriptData += scriptElm.outerHTML + "\n";
                                }
                            } else if (islinkInTemplate(fileLinkArr.scriptsRegEx, scriptElm.src) === false) {
                                if (frontMatterType === isYAML) {
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
                        if (scriptOutput === "" || frontMatterType === isYAML) {
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
                    "feedbackdata": function feedbackdata() {
                        // Sets feedback box
                        if (pageTitleObj !== null && "content" in pageTitleObj === true) {
                            return this.formatOutputType(frontMatterType, "feedbackData:\n  section: \"" + pageTitleObj.content + "\"\n", "\"feedbackData\": [\n\"section\": \"" + pageTitleObj.content + "\"\n]");
                        }
                        return "";
                    }, 
                    "notedlinks": function notedlinks() {
                        // Adds URLs as noted page links
                        let notedPageArr, 
                            linkRef = "", 
                            createNoteLink = function createNoteLink(refURIStr, linkText) {
                                let pageURI = new URL(refURIStr);

                                return this.formatOutputType(frontMatterType, "\n  - title: \"" + linkText + "\"\n    link: \"" + pageURI.origin + pageURI.pathname + "\"", "\n{\n\"title\": \"" + linkText + "\", \n\"link\": \"" + pageURI.origin + pageURI.pathname + "\"\n}");
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
                                    if (linkRef !== "") {
                                        linkRef += ", ";
                                    }
                                    linkRef += createNoteLink(notedPage.link, notedPage.title);
                                }
                            });
                        }
                        if (linkRef !== "") {
                            return this.formatOutputType(frontMatterType, "notedlinks:" + linkRef + "\n", "\"notedlinks\": [" + linkRef + "\n]");
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
                        let outputData = [this.layout(), this.title(), this.description(), this.subject(), this.keywords(), this.login(), this.altlangpage(), this.datemodified(), this.dateissued(), this.breadcrumbs(), this.css(), this.script().value, this.feedbackdata(), this.notedlinks()];

                        return this.formatOutputType(frontMatterType, outputData.join(""), outputData.filter(Boolean).join(", \n"));
                    }, 
                    "pagedata": function pagedata() {
                        return {
                            "fmCode": this.frontmatter(), 
                            "htmlCode": this.html(), 
                            "cssCode": this.style(), 
                            "scriptCode": this.script().inline
                        };
                    }, 
                    "pagecode": function pagecode() {
                        return this.formatOutputType(frontMatterType, "---\n" + this.frontmatter() + "---\n\n" + this.style() + this.html(), "---\n{\n" + this.frontmatter() + "\n}\n---\n\n" + this.style() + this.html());
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