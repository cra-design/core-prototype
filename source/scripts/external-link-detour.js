/*
* GitHub only script
*
* Replaces all external links with a link to exit intent page or replaces links with designated replace link found in JSON file
*
*/

"use strict";

//  exitPage.value = "https://cra-design.github.io/gst-hst-business/exit-intent.html",
//  exitPage.dataset.exitByUrl = "false",
//  exitPage.dataset.modLinkFile = "https://cra-design.github.io/gst-hst-business/templates/data/link_excludes.json", 
//  relExternalLnk.value = "false",
//  relExternalLnk.dataset.origin = "https://www.canada.ca", 

let exitPage = document.getElementById("exitpage");
let relExternalLnk = document.getElementById("relextlnk");
let inlineStyleText1, inlineStyleText2, 
    visitedLinkStyle = document.createElement("style"), 
    linkExcludes = [], 
    adjustLinks = function adjustLinks(elm, hrefSelector, actionSelector, formActionSelector, destStartPath) {
        let linkExcludeIndex = function linkExcludeIndex(testURI) {
                return linkExcludes.findIndex(function findlink(linkArr) {
                if ("origin" in linkArr) {
                    return linkArr.origin.toLowerCase() === testURI.toLowerCase();
                }
            }, testURI);
        }, 
        adjustHref = function adjustHref(el, destStartPath) {
            let adjustedURI = el, 
                replaceChar = ["?", "#", "&"];

            if (destStartPath !== "") {
                adjustedURI = new URL(adjustedURI, destStartPath).href;
            }
            replaceChar.forEach(function entityReplace (arrEl) {
                adjustedURI = adjustedURI.replace(arrEl, encodeURIComponent(arrEl));
            }, adjustedURI);
            return adjustedURI;
        }, 
        updateFormSubmit = function updateFormSubmit(formEl, formAttr, exitPageURI) {
            let hiddenInEl;

            hiddenInEl = document.createElement("input");
            hiddenInEl.value = adjustHref(formEl[formAttr], destStartPath);
            hiddenInEl.name = "uri";
            hiddenInEl.type = "hidden";
            formEl.append(hiddenInEl);
            formEl[formAttr] = exitPageURI;
        };

        if (exitPage !== null) {
            if (hrefSelector !== "") {
                $(elm).find(hrefSelector).each(function updateExitHref() {
                    const maxURILength = 2048;
                    let urlObj, queryHash, 
                        pagetitle = encodeURIComponent(this.innerText),
                        exitPageURI = exitPage.value, 
                        destURI = adjustHref(this.href, destStartPath), 
                        currentURI = this.protocol + "//" + this.hostname + this.pathname, 
                        lnkExclIdx = linkExcludeIndex(currentURI);

                    if (lnkExclIdx === -1) {
                        if ("exitByUrl" in exitPage.dataset && exitPage.dataset.exitByUrl.toLowerCase() === "true") {
                            urlObj = { "url": exitPageURI };
                            this.dataset.wbExitscript = JSON.stringify(urlObj);
                            this.classList.add("wb-exitscript");
                        } else {
                            if (pagetitle === "") {
                                pagetitle = encodeURIComponent(this.textContent);
                            }
                            switch (true) {
                                case (destURI.length > 0 && exitPageURI.length + destURI.length + 5 <= maxURILength):
                                    if (destURI.length > 0) {
                                        exitPageURI = exitPageURI + "?uri=" + destURI;
                                    }
                                    // falls through
                                case (pagetitle.length > 0 && exitPageURI + pagetitle.length + 11 <= maxURILength):
                                    if (pagetitle.length > 0) {
                                        exitPageURI = exitPageURI + "&pagetitle=" + pagetitle;
                                    }
                            }
                            this.href = exitPageURI;
                        }
                    } else if ("destination" in linkExcludes[lnkExclIdx] === true) {
                        queryHash = this.href.substring(linkExcludes[lnkExclIdx].origin.length);
                        if ("exitByUrl" in exitPage.dataset && exitPage.dataset.exitByUrl.toLowerCase() === "true") {
                            urlObj = { "url": linkExcludes[lnkExclIdx].destination + queryHash };
                            this.dataset.wbExitscript = JSON.stringify(urlObj);
                            this.classList.add("wb-exitscript");
                        } else {
                            this.href = linkExcludes[lnkExclIdx].destination + queryHash;
                        }
                    }
                });
                if ("exitByUrl" in exitPage.dataset && exitPage.dataset.exitByUrl.toLowerCase() === "true") {
                    $(".wb-exitscript").trigger("wb-init.wb-exitscript");
                }
            }

            if (actionSelector !== "") {
                $(elm).find(actionSelector).each(function updateExitAction() {
                    let queryHash,
                        exitPageURI = exitPage.value, 
                        currentURI = this.protocol + "//" + this.hostname + this.pathname, 
                        lnkExclIdx = linkExcludeIndex(currentURI);

                    this.method = "GET";
                    if (lnkExclIdx === -1) {
                        updateFormSubmit(this, "action", exitPageURI);
                    } else if ("destination" in linkExcludes[lnkExclIdx] === true) {
                        queryHash = this.href.substring(linkExcludes[lnkExclIdx].origin.length);
                        updateFormSubmit(this, "action", linkExcludes[lnkExclIdx].destination + queryHash);
                    }
                });
            }

            if (formActionSelector !== "") {
                $(elm).find(formActionSelector).each(function updateExitForm() {
                    let queryHash, 
                        exitPageURI = exitPage.value, 
                        currentURI = this.protocol + "//" + this.hostname + this.pathname,
                        lnkExclIdx = linkExcludeIndex(currentURI);

                    if (lnkExclIdx === -1) {
                        updateFormSubmit(this, "formaction", exitPageURI);
                    } else if ("destination" in linkExcludes[lnkExclIdx] === true) {
                        queryHash = this.href.substring(linkExcludes[lnkExclIdx].origin.length);
                        updateFormSubmit(this, "formaction", linkExcludes[lnkExclIdx].destination + queryHash);
                    }
                });
            }
        }
    }, 
    getDomain = function (url) {
        let pattern = new RegExp("^(https?:\/\/[^\/]+\/[^\/]*\/?)"),
            domains = pattern.exec(url);

        if (domains !== null) {
            return domains[0];
        }
        return "";
    }, 
    rootDomain = getDomain(window.location.origin + window.location.pathname), 
    defaultadjustLinks = function defaultadjustLinks(elm, isAjaxed, relExternalLnk) {
        adjustLinks(elm, "a[href^='http']a:not([href^='" + rootDomain + "'], [data-exit='false'], .wb-exitscript), area[href^='http']area:not([href^='" + rootDomain + "'], [data-exit='false'], .wb-exitscript)", "form[action^='http']form:not([action^='" + rootDomain + "'], [data-exit='false'], .wb-exitscript)", "input[formaction^='http']input:not([formaction^='" + rootDomain + "'], [data-exit='false'], .wb-exitscript), button[formaction^='http']button:not([formaction^='" + rootDomain + "'], [formaction^='/'], [data-exit='false'], .wb-exitscript)", "");
        if ((relExternalLnk && relExternalLnk.dataset.origin !== "") && (relExternalLnk.value.toLowerCase() === "true" || isAjaxed === true)) {
            adjustLinks(elm, "a[href^='/']a:not([data-exit='false'], .wb-exitscript), area[href^='/']area:not([data-exit='false'], .wb-exitscript)", "form[action^='/']form:not([data-exit='false'], .wb-exitscript)", "input[formaction^='/']input:not([data-exit='false'], .wb-exitscript), button[formaction^='/']button:not([data-exit='false'], .wb-exitscript)", relExternalLnk.dataset.origin);
        }
    };

//load link exclude JSON file
if ("modLinkFile" in exitPage.dataset && exitPage.dataset.modLinkFile !== "") {
    $.getJSON(exitPage.dataset.modLinkFile, function(data) {
        linkExcludes = data;
    });
}

//Remove visited link highlighting from links to exit page
if (exitPage !== null) {
    inlineStyleText1 = "Not to be copied to Canada.ca";
    inlineStyleText2 = "CSS for GitHub specific elements";
    if (document.documentElement.lang === "fr") {
        inlineStyleText1 = "Ne pas copier sur Canada.ca";
        inlineStyleText2 = "CSS pour les éléments spécifiques à GitHub";
    }
    visitedLinkStyle.innerHTML = "/*\n*** " + inlineStyleText1 + " ***\n\n" + inlineStyleText2 + "\n*//\n\n a[href*='" + exitPage.value + "']:visited { color:inherit; }\n.btn-primary[href*='" + exitPage.value + "']:visited, .btn-success[href*='" + exitPage.value + "']:visited, .btn-info[href*='" + exitPage.value + "']:visited, .btn-danger[href*='" + exitPage.value + "']:visited { color: #ffffff; }\n.btn-default[href*='" + exitPage.value + "']:visited { color: #335075; }\n.btn-warning[href*='" + exitPage.value + "']:visited { color: #000000; }\n";
    $("head").append(visitedLinkStyle);
}

// changes all external site links and forms to go to destination link
$(document).on("wb-ready.wb", function () {
    defaultadjustLinks(this, false, relExternalLnk);
});

// changes all GCM Menu external site links and forms to go to destination link
$(".gcweb-menu").on("wb-ready.gcweb-menu", function () {
    adjustLinks(this, ".gcweb-menu a[href^='http']a:not([href^='" + rootDomain + "'], [data-exit='false'], .wb-exitscript), .gcweb-menu area[href^='http']area:not([href^='" + rootDomain + "'], [data-exit='false'], .wb-exitscript)", ".gcweb-menu form[action^='http']form:not([action^='" + rootDomain + "'], [data-exit='false'], .wb-exitscript)", ".gcweb-menu input[formaction^='http']input:not([formaction^='" + rootDomain + "'], [data-exit='false'], .wb-exitscript), .gcweb-menu button[formaction^='http']button:not([formaction^='" + rootDomain + "'], [data-exit='false'], .wb-exitscript)", "");
    if (relExternalLnk && relExternalLnk.value.toLowerCase() === "true" && relExternalLnk.dataset.origin !== "") {
        adjustLinks(this, ".gcweb-menu a[href^='/']a:not([data-exit='false'], .wb-exitscript), .gcweb-menu area[href^='/']area:not([data-exit='false'], .wb-exitscript)", ".gcweb-menu form[action^='/']form:not([data-exit='false'], .wb-exitscript)", ".gcweb-menu input[formaction^='/']input:not([data-exit='false'], .wb-exitscript), .gcweb-menu button[formaction^='/']button:not([data-exit='false'], .wb-exitscript)", relExternalLnk.dataset.origin);
    }
});

// changes all AJAXed external site links and forms to go to destination link
$("[data-ajax-after], [data-ajax-append], [data-ajax-before], [data-ajax-prepend], [data-ajax-replace]").on("wb-contentupdated", function () {
    defaultadjustLinks(this, true, relExternalLnk);
});
