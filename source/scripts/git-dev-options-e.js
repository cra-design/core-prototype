/*
* Github only script
*
* Creates developer buttons - go to github source version annd contenEditable page edit buttons 
*
*/

"use strict";

let devOptions = document.getElementById("devoptions");
let keywords = document.getElementById("pageKeywords");
let sourceUrlList = document.getElementById("sourceurl");
let insertId = "test-banner";

let sourceUrlArr, pageOrigin, 
    pageKey = location.pathname.replaceAll("/","").replaceAll(":","").replaceAll("-","").split(".").slice(0, -1).join(".").toLowerCase(), 
    pageStorage = localStorage.getItem(pageKey), 
    getGithubURL = function (pageURL) {
        let pageName = "", 
            githubURL = null;

        if (pageURL.indexOf(".htm") === -1) {
            pageName = "index.html";
        }

        switch (true) {
            // Generate github.com URL's from [repo name].github.io URL's
            case pageURL.indexOf(".github.io/") > -1:
                githubURL = pageURL.toString().replace(new RegExp("^https:\/\/(.*?)\.github\.io\/(.*?)\/((?:.*)(?=\/))?(\/?.*\..+)?"), "https:\/\/github\.com\/$1\/$2\/blob\/main\/$3$4" + pageName);
                break;
            // Generate github.com URL's from test.canada.ca URL's
            case pageURL.indexOf("://test.canada.ca/") > -1:
                githubURL = pageURL.toString().replace(new RegExp("^https:\/\/test\.canada\.ca\/(.*?)\/((?:.*)(?=\/))?(\/?.*\..+)?"), "https:\/\/github\.com\/gc-proto\/$1\/blob\/master\/$2$3" + pageName);
                break;
            // Generate github.com URL's from [repo name].alpha.canada.ca URL's
            case pageURL.indexOf(".alpha.canada.ca/") > -1:
                githubURL = pageURL.toString().replace(new RegExp("^https:\/\/design\.cra-arc\.alpha\.canada\.ca\/(.*?)\/((?:.*)(?=\/))?(\/?.*\..+)?"), "https:\/\/github\.com\/alpha-canada-ca\/cra-ucd-guide\/blob\/main\/$1\/$2$3" + pageName);
                break;
        }
        if (githubURL !== null) {
            return githubURL;
        } else {
            return "";
        }
    };

document.addEventListener("DOMContentLoaded", function initDevOpts() {
    let devOptionsLocStore = null, 
        editStartContent = "";

    if (devOptions !== null && "locStorage" in devOptions.dataset && devOptions.dataset.locStorage !== "") {
        devOptionsLocStore = localStorage.getItem(devOptions.dataset.locStorage);
    }

    if (devOptionsLocStore === "true" || (devOptions !== null && devOptions.value.toLowerCase() === "true" && devOptionsLocStore !== "false")) {
        $("#site-banner-inc").on("wb-contentupdated", function () {
            let pageInfo, titleElm, subjectElm, descriptionElm, keywordsElm, modifyDateElm, issueDateElm, 
                insertElm = document.getElementById(insertId), 
                gitURL = "", 
                githubLinkInfo = "", 
                sourceLinkInfo = "", 
                metadataInfo = "", 
                overlaySec = "", 
                setEditButton = function setEditButton() {
                    document.getElementById("editBtn").title = "Edit";
                    document.getElementById("editIcon").classList.remove("fa-window-close", "fa-save");
                    document.getElementById("editIcon").classList.add("fa-edit");
                    document.getElementById("iconText").innerHTML = "Edit";
                }, 
                setStopEditButton = function setStopEditButton() {
                    document.getElementById("editBtn").title = "Stop edit";
                    document.getElementById("editIcon").classList.remove("fa-edit", "fa-save");
                    document.getElementById("editIcon").classList.add("fa-window-close");
                    document.getElementById("iconText").innerHTML = "Stop edit";
                }, 
                setCacheButton = function setCacheButton() {
                    document.getElementById("editBtn").title = "Cache edits";
                    document.getElementById("editIcon").classList.remove("fa-edit", "fa-window-close");
                    document.getElementById("editIcon").classList.add("fa-save");
                    document.getElementById("iconText").innerHTML = "Cache edits";
                },
                initTinyMCE = function () {
                    tinymce.init({
                        promotion: false, 
                        license_key: "gpl", 
                        setup: function (ed) {
                            ed.on("init", function (e) {
                                pageOrigin = document.querySelector("main").innerHTML;

                                // Load modied page content if it exists from local Storage
                                if (localStorage.getItem(pageKey)) {
                                    document.querySelector("main").innerHTML = localStorage.getItem(pageKey);
                                }
                                ed.execCommand("mceVisualBlocks");
                            }),
                            ed.on("input Change", function(e) {
                                if (e.originalEvent === undefined || ("command" in e.originalEvent === false && ("focusedEditor" in e.originalEvent === true && e.originalEvent.focusedEditor !== null)) || ("command" in e.originalEvent === true && e.originalEvent.command !== "mceVisualBlocks" && e.originalEvent.command !== "mceVisualChars")) {
                                    switch (document.querySelector("main").innerHTML) {
                                        case pageOrigin:
                                            localStorage.removeItem(pageKey);
                                            pageStorage = null;
                                            document.getElementById("deleteChangeBtn").classList.add("hidden");
                                            setStopEditButton();
                                            break;
                                        case editStartContent:
                                        case pageStorage:
                                            setStopEditButton();
                                            break;
                                        default:
                                            setCacheButton();
                                            break;
                                    }
                                }
                            });
                        }, 
                        plugins: "accordion advlist anchor autolink autoresize charmap code codesample fullscreen help image importcss link lists media nonbreaking pagebreak quickbars searchreplace table visualblocks visualchars save", 
                        toolbar: "undo redo | searchreplace | blocks styles removeformat | bold code | bullist numlist table | link unlink anchor | outdent indent alignnone | hr nonbreaking charmap | visualblocks visualchars | help", 
                        inline: true, 
                        quickbars_image_toolbar: false, 
                        quickbars_selection_toolbar: true, 
                        quickbars_insert_toolbar: false, 
                        relative_urls: false, 
                        entity_encoding: "raw", 
                        importcss_append: true, 
                        content_css: "https://wet-boew.github.io/themes-dist/GCWeb/GCWeb/css/theme.min.css", 
                        selector: "main"
                    });
                };

            // Add toolbar and buttons
            if (insertElm !== null) {
                gitURL = getGithubURL(window.location.origin + window.location.pathname);
                pageInfo = "<div id=\"devtoolbar\" class=\"pull-right mrgn-rght-md\">\n    <ul class=\"btn-toolbar list-inline\" role=\"toolbar\">\n        <li id=\"editBtnGrp\" class=\"btn-group\">";
                pageInfo = pageInfo + "<a id=\"editBtn\" class=\"btn btn-default btn-sm\" data-exit=\"false\" href=\"\" title=\"Edit\"><span id=\"editIcon\" class=\"fa fa-edit mrgn-tp-sm\"></span><span id=\"iconText\" class=\"wb-inv\">Edit</span></a>";
                pageInfo = pageInfo + "<a id=\"deleteChangeBtn\" class=\"btn btn-default btn-sm";
                if (localStorage.getItem(pageKey) === null) {
                    pageInfo = pageInfo + " hidden";
                }
                pageInfo = pageInfo + "\" title=\"Remove edits\" href=\"#\"><span class=\"far fa-trash-alt mrgn-tp-sm\"></span><span class=\"wb-inv\">Remove edits</span></a>";
                pageInfo = pageInfo + "</li>\n";
                if (sourceUrlList !== null && sourceUrlList.value !== "") {
                    sourceUrlArr = JSON.parse(sourceUrlList.value);
                    if ((sourceUrlArr.length === 1 && sourceUrlArr[0].sourcetitle.trim() !== "") || sourceUrlArr.length > 1) {
                        sourceLinkInfo = "<h3 class=\"mrgn-tp-sm\">Pertinent links</h3>\n<ol id=\"testpage-source\" class=\"list-inline mrgn-bttm-0\">\n";
                        sourceUrlArr.forEach(function addSourceLinks(sourceUrlData) {
                           sourceLinkInfo = sourceLinkInfo + "<li><span class=\"glyphicon glyphicon-link mrgn-rght-sm\"></span><a data-exit=\"false\" href=\"" + sourceUrlData.sourcelink + "\" target=\"_blank\">" + sourceUrlData.sourcetitle + "</a></li>\n";
                        });
                        sourceLinkInfo = sourceLinkInfo + "</ol>\n";
                    }
                }
                titleElm = document.querySelector("meta[name=dcterms\\.title]");
                if (titleElm !== null && "content" in titleElm === true && titleElm.content.trim() !== "") {
                    metadataInfo = metadataInfo + "<p class=\"mrgn-bttm-sm\"><strong>Title</strong>:&nbsp;" + titleElm.content.trim() + "</p>\n";
                }
                subjectElm = document.querySelector("meta[name=dcterms\\.subject]");
                if (subjectElm !== null && "content" in subjectElm === true && subjectElm.content.trim() !== "") {
                    metadataInfo = metadataInfo + "<p class=\"mrgn-bttm-sm\"><strong>Subject</strong>:&nbsp;" + subjectElm.content.trim() + "</p>\n";
                }
                descriptionElm = document.querySelector("meta[name=dcterms\\.description]");
                if (descriptionElm !== null && "content" in descriptionElm === true && descriptionElm.content.trim() !== "") {
                    metadataInfo = metadataInfo + "<p class=\"mrgn-bttm-sm\"><strong>Description</strong>:&nbsp;" + descriptionElm.content.trim() + "</p>\n";
                }
                if (keywords !== null && keywords.value.trim() !== "") {
                    metadataInfo = metadataInfo + "<p><strong>Keywords</strong>:&nbsp;<span id=\"pageKeywords\" class=\"mrgn-lft-sm\">" + keywords.value + "</span></p>";
                } else {
                    keywordsElm = document.querySelector("meta[name=dcterms\\.keywords]");
                    if (keywordsElm !== null && "content" in keywordsElm === true && keywordsElm.content.trim() !== "") {
                        metadataInfo = metadataInfo + "<p class=\"mrgn-bttm-sm\"><strong>Keywords</strong>:&nbsp;" + keywordsElm.content.trim() + "</p>\n";
                    }
                }
                modifyDateElm = document.querySelector("meta[name=dcterms\\.modified]");
                if (modifyDateElm !== null && "content" in modifyDateElm === true && modifyDateElm.content.trim() !== "") {
                    metadataInfo = metadataInfo + "<p class=\"mrgn-bttm-sm\"><strong>Date modified</strong>:&nbsp;" + modifyDateElm.content.trim() + "</p>\n";
                }
                issueDateElm = document.querySelector("meta[name=dcterms\\.issued]");
                if (issueDateElm !== null && "content" in issueDateElm === true && issueDateElm.content.trim() !== "") {
                    metadataInfo = metadataInfo + "<p class=\"mrgn-bttm-sm\"><strong>Date issued</strong>:&nbsp;" + issueDateElm.content.trim() + "</p>\n";
                }

                if (gitURL !== "") {
                    githubLinkInfo = githubLinkInfo + "        <p><a data-exit=\"false\" href=\"#\" target=\"_blank\"><span class=\"fab fa-github mrgn-tp-sm mrgn-rght-sm\"></span>Go to Github source</a></p>\n";
                }

                if (sourceLinkInfo + githubLinkInfo + metadataInfo !== "") {
                    pageInfo = pageInfo + "        <li id=\"pageInfoBtnGrp\" class=\"btn-group\"><a id=\"pageInfoBtn\" class=\"btn btn-default btn-sm wb-lbx\" data-exit=\"false\" href=\"#dev-page-info\" aria-controls=\"dev-page-info\" role=\"button\" title=\"Page information\"><span class=\"glyphicon glyphicon-info-sign mrgn-tp-sm\"></span><span class=\"wb-inv\">Page information</span></a></li>\n";
                }

                if (gitURL !== "") {
                    pageInfo = pageInfo + "        <li id=\"githubBtnGrp\" class=\"btn-group\"><a id=\"githubBtn\" class=\"btn btn-default btn-sm\" data-exit=\"false\" href=\"#\" title=\"Go to Github source\" target=\"_blank\"><span class=\"fab fa-github mrgn-tp-sm\"></span><span class=\"wb-inv\">Go to Github source</span></a></li>\n";
                }

                pageInfo = pageInfo + "    </ul>\n</div>\n";
                insertElm.innerHTML = pageInfo + insertElm.innerHTML;
                if (sourceLinkInfo + githubLinkInfo + metadataInfo !== "") {
                    overlaySec = overlaySec + "<section id=\"dev-page-info\" class=\"mfp-hide modal-dialog modal-content overlay-def\">\n    <header class=\"modal-header\">\n        <h2 class=\"modal-title\">Page information</h2>\n    </header>\n    <div id=\"dev-info-body\" class=\"modal-body\">\n";
                    overlaySec = overlaySec + sourceLinkInfo;
                    overlaySec = overlaySec + githubLinkInfo;
                    if (sourceLinkInfo + githubLinkInfo !== "" && metadataInfo !== "") {
                        overlaySec = overlaySec + "\n<hr>\n";
                    }
                    if (metadataInfo !== "") {
                        overlaySec = overlaySec + "<h3 class=\"mrgn-tp-sm mrgn-bttm-md\">Metadata</h3>\n" + metadataInfo;
                    }
                    overlaySec = overlaySec + "\n    </div>\n</section>\n";
                    insertElm.outerHTML = insertElm.outerHTML + overlaySec;
                    $(".wb-lbx").trigger("wb-init.wb-lbx");
                }
            }

            if (document.getElementById("devtoolbar") !== null) {

                // Initalize Edit button
                if (document.getElementById("editBtn") !== null) {
                    document.getElementById("editBtn").addEventListener("click", function (event) {
                        let currentContent, 
                            editArea = document.querySelector("main");

                        if (editArea !== null) {
                            currentContent = editArea.innerHTML;
                            if (editArea.contentEditable === "true") {

                                // Caches current modified page content to local storage
                                if (editStartContent !== "") {
                                    if (pageOrigin === currentContent) {
                                        localStorage.removeItem(pageKey);
                                        document.getElementById("deleteChangeBtn").classList.add("hidden");

                                    } else if (editStartContent !== currentContent) {
                                        localStorage.setItem(pageKey, currentContent);
                                        document.getElementById("deleteChangeBtn").classList.remove("hidden");
                                    }
                                    editStartContent = "";
                                }
                                tinymce.remove();
                                editArea.contentEditable = "false";
                                setEditButton();
                                // document.designMode = "off";
                            } else {
                                initTinyMCE();
                                editArea.contentEditable = "true";
                                editStartContent = editArea.innerHTML;
                                setStopEditButton();
                                // document.designMode = "on";
                            }
                        }
                        void 0;
                        event.preventDefault();
                    });
                }

                // Delete page edits button
                document.getElementById("deleteChangeBtn").addEventListener("click", function() {
                    document.querySelector("main").innerHTML = pageOrigin;
                    localStorage.removeItem(pageKey);
                    editStartContent = "";
                    document.getElementById("deleteChangeBtn").classList.add("hidden");
                    setEditButton();
                });

                // Initalize Github button
                if (document.getElementById("githubBtn") !== null && gitURL !== "") {
                    document.getElementById("githubBtn").href = gitURL;
                }
            }
        });
    }
}, { once: true });
