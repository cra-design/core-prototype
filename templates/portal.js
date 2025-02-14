"use strict";

var anchorUri,
    anchorEl,
    expandHideBtn,
    quartzSideNav = document.getElementsByTagName("quartz-sidenav"),
    navLink = quartzSideNav[0].getElementsByTagName("a"),
    contentSection = document.getElementsByTagName("mat-drawer-content"),
    accordions = contentSection[0].getElementsByTagName("mat-expansion-panel"),
    sideNav = document.querySelector("mat-sidenav"),
    accountBtn = document.querySelector(".quartz-primary-button"),
    sdMenuBtn = document.getElementsByTagName("quartz-icon-button"),
    sideMenuBtn = sdMenuBtn[0].getElementsByTagName("button"),
    printBtns = document.querySelectorAll("button[value='print']"),
    linkBtns = document.querySelectorAll("button[value^='http']"),
    tabs = document.querySelectorAll("[role='tab']"),
    dialogs = document.querySelectorAll("button[popovertarget]"),
    accordionActivate = function () {
        let matPanel = this.closest("mat-expansion-panel"),
            matIcon = matPanel.querySelector("mat-icon"),
            matContent = matPanel.querySelector(".mat-expansion-panel-content"),
            expandMenuState = { Open: " chevron_right ", Close: " expand_more " },
            matPanelHead = this.closest("mat-expansion-panel-header"),
            rootExpandLink = matPanel.getElementsByTagName("a")[0];

        if (matPanel.classList.contains("mat-expanded") === false) {
            if (rootExpandLink !== undefined) {
                clearLinks(this);
                rootExpandLink.classList.add("open");
            }
            matPanel.classList.add("mat-expanded");
            if (matPanelHead !== null) {
                matPanelHead.classList.add("mat-expanded");
                matPanelHead.ariaExpanded = true;
            }
            if (matContent !== null) {
                matContent.style.height = "";
                matContent.style.visibility = "";
            }
            if (matIcon.textContent === expandMenuState.Open) {
                matIcon.textContent = expandMenuState.Close;
            }
        } else {
            resetAccordion(this);
        }
    },
    resetAccordion = function (el) {
        let matPanel = el.closest("mat-expansion-panel"),
            expandMenuState = { Open: " chevron_right ", Close: " expand_more " },
            matPanelHead = el.closest("mat-expansion-panel-header"),
            matIcon = matPanel.querySelector("mat-icon"),
            matContent = matPanel.querySelector(".mat-expansion-panel-content");

        el.classList.remove("open");
        matPanel.classList.remove("mat-expanded");
        if (matPanelHead !== null) {
            matPanelHead.classList.remove("mat-expanded");
            matPanelHead.ariaExpanded = false;
        }
        if (matContent !== null) {
            matContent.style.height = "0px";
            matContent.style.visibility = "hidden";
        }
        if (matIcon.textContent === expandMenuState.Close) {
            matIcon.textContent = expandMenuState.Open;
        }
    },
    clearLinks = function (activeEl) {
        let matPanel = activeEl.closest("mat-expansion-panel");

        for (let linkTag of navLink) {
            if (linkTag.classList.contains("quartz-expand-sidenav-button") === true && matPanel !== linkTag.closest("mat-expansion-panel")) {
                resetAccordion(linkTag);
            } else {
                linkTag.classList.remove("active-link");
            }
        }
    },
    selectSideElm = function () {
        if (this.classList.contains("active-link") === false) {
            clearLinks(this);
            this.classList.add("active-link");
        }
    },
    hideSideNav = function () {
        showHideMenu(false);
    },
    showHideMenu = function (showMenu) {
        let sideNavContain = document.querySelector("mat-sidenav-container"),
            sideNav = document.querySelector("mat-sidenav"),
            backdropEl = document.querySelector(".mat-drawer-backdrop");

        if (showMenu !== true && sideNav.classList.contains("mat-drawer-opened") === true) {
            //Hide side navigation
            sideNavContain.classList.remove("mat-drawer-container-has-open");
            sideNav.classList.remove("mat-drawer-opened");
            backdropEl.classList.remove("mat-drawer-shown");
            backdropEl.removeEventListener("click", hideSideNav, false);

            sideNav.style.transform = "";
            sideNav.style.boxShadow = "none";
            sideNav.style.visibility = "hidden";
        } else {
            //Show side navigation
            sideNavContain.classList.add("mat-drawer-container-has-open");
            sideNav.classList.add("mat-drawer-opened");
            if (window.innerWidth < 960) {
                backdropEl.classList.add("mat-drawer-shown");
                backdropEl.addEventListener("click", hideSideNav, false);
            }
            sideNav.style.transform = "none";
            sideNav.style.boxShadow = "";
            sideNav.style.visibility = "visible";
        }
    },
    reSizeAction = function () {
        let backdropEl = document.querySelector(".mat-drawer-backdrop"),
            altLangLnk = document.querySelector("[lang='fr']"),
            showHideNav = function (hideSideNav) {
                var sideMenuIcon = document.querySelector("quartz-icon-button"),
                    sideNavContain = document.querySelector("mat-sidenav-container"),
                    sideNav = document.querySelector("mat-sidenav"),
                    sideNavContent = document.querySelector("mat-sidenav-content"),
                    ribbonTitle = document.querySelector(".quartz-ribbon-menu-title"),
                    ribbonSubTitle = document.querySelector(".quartz-ribbon-menu-subtitle"),
                    footEl = document.querySelector(".footer-down, .footer-mobile.down"),
                    footLink = document.querySelector(".link-wrap");

                if (hideSideNav === true) {
                    // large screen UI adjustments
                    sideMenuIcon.classList.add("quartz-invisible");
                    sideNavContain.classList.remove("mat-drawer-transition");
                    sideNav.classList.add("mat-drawer-side");
                    sideNav.classList.remove("mat-drawer-over");
                    sideNavContent.style.marginLeft = "280px";
                    ribbonTitle.classList.remove("quartz-invisible");
                    ribbonSubTitle.classList.remove("quartz-invisible");
                    footEl.classList.remove("column-count-one");
                    footLink.classList.add("footer-down");
                    footLink.classList.remove("footer-mobile-down");
                    sideNav.classList.add("mat-drawer-opened");
                    showHideMenu(true);
                } else {
                    // small screen UI adjustments
                    sideMenuIcon.classList.remove("quartz-invisible");
                    sideNavContain.classList.add("mat-drawer-transition");
                    sideNav.classList.add("mat-drawer-over");
                    sideNav.classList.remove("mat-drawer-side");
                    sideNavContent.style.marginLeft = "";
                    ribbonTitle.classList.add("quartz-invisible");
                    ribbonSubTitle.classList.add("quartz-invisible");
                    footEl.classList.add("column-count-one");
                    footLink.classList.add("footer-mobile-down");
                    footLink.classList.remove("footer-down");
                }
            };

        if (window.innerWidth < 768) {
            altLangLnk.textContent = "fr";
        } else {
            altLangLnk.textContent = "Français";
        }
        if (window.innerWidth < 960) {
            showHideNav(false);
            if (sideNav.classList.contains("mat-drawer-opened") === true) {
                backdropEl.classList.add("mat-drawer-shown");
                backdropEl.addEventListener("click", hideSideNav, false);
            }
        } else {
            showHideNav(true);
            if (sideNav.classList.contains("mat-drawer-opened") === true) {
                backdropEl.classList.remove("mat-drawer-shown");
                backdropEl.removeEventListener("click", hideSideNav, false);
            }
        }
    },
    showLoginMenu = function () {
        var menuTrigger = document.querySelector(".mat-mdc-menu-trigger"),
            hideprofileMenu = function () {
                showProfileMenu(true);
            },
            showProfileMenu = function (showMenu) {
                let accountBtnPos = accountBtn.getBoundingClientRect(),
                    backdropTrigger = document.querySelector(".cdk-overlay-container"),
                    overlayBG = document.querySelector(".cdk-overlay-transparent-backdrop"),
                    profileMenu = document.querySelector(".cdk-overlay-connected-position-bounding-box");

                if (showMenu === true) {
                    menuTrigger.ariaExpanded = "false";
                    backdropTrigger.classList.add("quartz-invisible");
                    overlayBG.classList.add("quartz-invisible");
                    backdropTrigger.removeEventListener("click", hideprofileMenu, false);
                    profileMenu.classList.add("quartz-invisible");
                } else {
                    //                          this.ariaControls = "mat-menu-panel-9";
                    menuTrigger.ariaExpanded = "true";
                    backdropTrigger.classList.remove("quartz-invisible");
                    overlayBG.classList.remove("quartz-invisible");
                    backdropTrigger.addEventListener("click", hideprofileMenu, false);
                    profileMenu.style.top = accountBtnPos.bottom + "px";
                    if (window.innerWidth < 960) {
                        profileMenu.style.left = accountBtnPos.left - 118.5 + "px";
                    } else {
                        profileMenu.style.left = accountBtnPos.left + "px";
                    }
                    profileMenu.classList.remove("quartz-invisible");
                }
            };

        if (menuTrigger.ariaExpanded === "true") {
            showProfileMenu(true);
        } else {
            showProfileMenu(false);
        }
    },
    tabActivate = function () {
        let tabContent,
            tabGroup = this.closest("quartz-tabs"),
            tabHeadArr = tabGroup.querySelectorAll("[role='tab']"),
            tabBodyArr = tabGroup.querySelectorAll("mat-tab-body");

        for (let i = 0; i < tabHeadArr.length; i++) {
            if (tabHeadArr[i] !== this) {
                tabHeadArr[i].classList.remove("mdc-tab--active", "mdc-tab-indicator--active");
                tabHeadArr[i].ariaSelected = false;
                tabHeadArr[i].tabindex = -1;
                if (tabBodyArr[i]) {
                    tabContent = tabBodyArr[i].querySelector(".mat-mdc-tab-body-content");
                    tabBodyArr[i].ariaHidden = true;
                    tabContent.style.transform = "translate3d(-100%, 0px, 0px)";
                    tabContent.style.minHeight = "1px";
                    tabBodyArr[i].classList.remove("mat-mdc-tab-body-active");
                    tabContent.style.visibility = "hidden";
                }
            } else {
                this.classList.add("mdc-tab--active", "mdc-tab-indicator--active");
                this.ariaSelected = true;
                this.tabindex = 0;
                if (tabBodyArr[i]) {
                    tabContent = tabBodyArr[i].querySelector(".mat-mdc-tab-body-content");
                    tabContent.style.transform = "none";
                    tabContent.style.minHeight = "";
                    tabBodyArr[i].ariaHidden = false;
                    tabBodyArr[i].classList.add("mat-mdc-tab-body-active");
                    tabContent.style.visibility = "";
                }
            }
        }
    },
    gotoPage = function () {
        window.location.href = this.value;
    },
    openDialog = function () {
        let overlayWrap = this.popoverTargetElement.closest(".cdk-global-overlay-wrapper"),
            closeButton = this.popoverTargetElement.querySelector("quartz-secondary-button"),
            closeIcon = this.popoverTargetElement.querySelector("quartz-icon-button"),
            htmlTag = document.getElementsByTagName("html")[0],
            appRootTag = document.getElementsByTagName("app-root")[0],
            backdropTrigger = document.querySelector(".cdk-overlay-container"),
            overlayBG = document.querySelector(".cdk-overlay-dark-backdrop"),
            endDialog = function () {
                htmlTag.classList.remove("cdk-global-scrollblock");
                htmlTag.style.left = "";
                htmlTag.style.top = "";
                appRootTag.ariaHidden = false;
                overlayWrap.classList.add("quartz-invisible");
                backdropTrigger.classList.add("quartz-invisible");
                overlayBG.classList.add("quartz-invisible");
                closeButton.removeEventListener("click", endDialog, false);
                closeIcon.removeEventListener("click", endDialog, false);
            };

        if (htmlTag.classList.contains("cdk-global-scrollblock") === false) {
            htmlTag.classList.add("cdk-global-scrollblock");
            htmlTag.style.left = "0px;";
            htmlTag.style.top = "0px;";
            appRootTag.ariaHidden = true;
            overlayWrap.classList.remove("quartz-invisible");
            backdropTrigger.classList.remove("quartz-invisible");
            overlayBG.classList.remove("quartz-invisible");
            closeButton.addEventListener("click", endDialog, false);
            closeIcon.addEventListener("click", endDialog, false);
        }
    };


for (let i = 0; i < navLink.length; i++) {
    if (navLink[i].classList.contains("quartz-expand-sidenav-button") === true) {
        navLink[i].addEventListener("click", accordionActivate, false);
    } else {
        navLink[i].addEventListener("click", selectSideElm, false);
    }
}

for (let i = 0; i < accordions.length; i++) {
    expandHideBtn = accordions[i].getElementsByTagName("mat-panel-title");
    expandHideBtn[0].addEventListener("click", accordionActivate, false);
}

for (let i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", tabActivate, false);
}

for (let i = 0; i < linkBtns.length; i++) {
    linkBtns[i].addEventListener("click", gotoPage, false);
}

for (let i = 0; i < printBtns.length; i++) {
    printBtns[i].addEventListener("click", function() {print()}, false);
}

for (let i = 0; i < dialogs.length; i++) {
    dialogs[i].addEventListener("click", openDialog, false);
}

sideMenuBtn[0].addEventListener("click", showHideMenu, false);
sideNav.classList.add("mat-drawer-opened");
showHideMenu(true);

if (accountBtn !== null) {
    accountBtn.addEventListener("click", showLoginMenu, false);
}

window.onresize = reSizeAction;
reSizeAction();

anchorUri = document.location.hash;
if (anchorUri) {
    anchorEl = document.querySelector("[href='" + anchorUri + "']");
    if (anchorEl) {
        anchorEl.closest("mat-expansion-panel");
        if (anchorEl.closest("mat-expansion-panel")) {
            accordionActivate.call(anchorEl);
        } else {
            selectSideElm.call(anchorEl);
        }
    }
}
/*

Accordion (done)
Tabs (done)
Dialog (done)
Sub Ribbon (done)

multi column
Grid

Filter
-------

-------

make elements into ajaxed components
see if I can make exact working copy of quartz demo page 

Stepper

checkbox (all/partial checked indicator)

button form="form_id" *formaction="url"* popovertarget="element_id" value=""  
.quartz-sidenav .mat-drawer-content {
    min-height: 100vh;
}

*/
