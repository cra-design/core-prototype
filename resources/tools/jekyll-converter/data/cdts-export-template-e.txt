<!DOCTYPE html>
<!--[if lt IE 9]>
<html class="no-js lt-ie9" lang="en" dir="ltr">
<![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js" lang="en" dir="ltr">
<!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <!-- Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW) wet-boew.github.io/wet-boew/License-en.html / wet-boew.github.io/wet-boew/Licence-fr.html -->
${frontData.title ? `        <title>${frontData.title}</title>` : ``}
        <meta content="width=device-width, initial-scale=1" name="viewport">
        <link rel="schema.dcterms" href="https://purl.org/dc/terms/">
        <!-- Meta data -->
        <meta name="author" content="Canada Revenue Agency">
        <meta name="dcterms.audience" content="general public">
        <meta name="dcterms.creator" content="Canada Revenue Agency">
        <meta name="dcterms.identifier" content="Canada_Revenue_Agency">
        <meta name="dcterms.language" title="ISO639-2/T" content="eng">
        <meta name="dcterms.spatial" content="Canada">
${frontData.title ? `        <meta name="dcterms.title" content="${frontData.title}">` : ``}
${frontData.description ? `        <meta name="description" content="${frontData.description}">
        <meta name="dcterms.description" content="${frontData.description}">` : ``}
${frontData.subject ? `        <meta name="dcterms.subject" title="gccore" content="${frontData.subject}">` : ``}
${frontData.keywords ? `        <meta name="keywords" content="${frontData.keywords}">` : ``}
${frontData.dateModified ? `        <meta name="dcterms.modified" title="W3CDTF" content="${frontData.dateModified}">` : ``}
${frontData.dateIssued ? `        <meta name="dcterms.issued" title="W3CDTF" content="${frontData.dateIssued}">` : ``}
        <!-- Meta data-->
        <!-- Load stylesheet -->
        <link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/cdts/gcweb/v5_0_5/cdts/cdts-styles.css">
        <link rel="stylesheet" href="https://wet-boew.github.io/themes-dist/GCWeb/GCWeb/m%C3%A9li-m%C3%A9lo/2025-12-mille-iles.css">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css">
        <link href="https://www.canada.ca/etc/designs/canada/wet-boew/assets/favicon.ico" rel="icon" type="image/x-icon">        
${frontData.css ? `${frontData.css.map(item => `        <link rel="stylesheet" href="${item}">
`).join("")}` : ``}        <!-- START of GitHub only testing banner CSS -->
        <link rel="stylesheet" href="https://${frontData.domain}/core-prototype/source/css/testing-banner.css">
        <!-- END of GitHub only testing banner CSS -->
        <script src="https://www.canada.ca/etc/designs/canada/cdts/gcweb/v5_0_5/cdts/compiled/wet-en.js"></script>
</head>
<body${frontData.pageClass ? ` class="${frontData.pageClass}"` : ``}>
${frontData.auth ? `    <nav>
        <ul id="wb-tphp">
            <li class="wb-slc"><a class="wb-sl" href="#wb-cont">Skip to main content</a></li>
            <li class="wb-slc visible-sm visible-md visible-lg"><a class="wb-sl" href="#wb-info">Skip to About this site</a></li>
        </ul>
    </nav>
    <header>` : `    <noscript>
        <!-- Write closure fall-back static file -->
        <!-- /ROOT/etc/designs/canada/cdts/gcweb/v5_0_5/cdts/static/refTop.html -->
    </noscript>
    <!-- Load/activate closure template scripts -->`}
    <!-- START of GitHub only template section -->
    <data id="devoptions" data-loc-storage="gitCRATemplateDevOptions" value="true"></data>
    <data id="exitpage" data-exit-by-url="false" data-mod-link-file="https://${frontData.domain}/core-prototype/source/data/exclude-redirect-links.json" value="https://${frontData.domain}/core-prototype/source/exit-intent-e.html"></data>
    <data id="relextlnk" data-origin="https://www.canada.ca" value="false"></data>
${frontData.notedlinks ? `    <data id="notedlinks" value="[[${frontData.notedlinks.map(item => `{&quot;sourcetitle&quot;: &quot;${item.title}&quot;, &quot;sourcelink&quot;: &quot;${item.link}&quot;}`).join(", ")}]}"></data>` : ``}
${frontData.keywords ? `    <data id="pageKeywords" value="${frontData.keywords}"></data>` : ``}
    <div id="site-banner-inc" class="wb-disable-allow" data-ajax-replace="https://${frontData.domain}/core-prototype/source/includes/site-banner-e.inc"></div>
    <!-- END of GitHub only template section -->
${frontData.auth ? `        <div id="wb-bnr" class="container">
            <div class="row">
                <section id="wb-lng" class="col-xs-3 col-sm-12 pull-right text-right">
                    <h2 class="wb-inv">Language selection</h2>
                    <ul class="list-inline mrgn-bttm-0">
                        <li><a lang="fr" hreflang="fr" href="${frontData.altLangPage}"><span class="hidden-xs" translate="no">Français</span><abbr title="Français" translate="no" class="visible-xs h3 mrgn-tp-sm mrgn-bttm-0 text-uppercase">fr</abbr></a></li>
                    </ul>
                </section>
                <div class="brand col-xs-9 col-sm-5 col-md-4" property="publisher" typeof="GovernmentOrganization">
                    <a href="https://www.canada.ca/en.html" property="url"><img src="https://www.canada.ca/etc/designs/canada/cdts/gcweb/v5_0_5/wet-boew/assets/sig-blk-en.svg" alt="Government of Canada" property="logo"><span class="wb-inv"> / <span lang="fr">Gouvernement du Canada</span></span></a>
                    <meta property="name" content="Government of Canada">
                    <meta property="areaServed" typeof="Country" content="Canada">
                    <link property="logo" href="https://www.canada.ca/etc/designs/canada/cdts/gcweb/v5_0_5/wet-boew/assets/wmms-blk.svg">
                </div>
                <section id="wb-srch" class="col-lg-offset-4 col-md-offset-4 col-sm-offset-2 col-xs-12 col-sm-5 col-md-4 visible-md visible-lg">
                    <h2>Search CRA</h2>
                    <form action="https://www.canada.ca/en/revenue-agency/search.html" method="get" name="cse-search-box" role="search">
                        <div class="form-group wb-srch-qry">
                            <label for="wb-srch-q" class="wb-inv">Search CRA</label>
                            <input id="wb-srch-q" list="wb-srch-q-ac" class="wb-srch-q form-control" name="q" type="search" value="" size="34" maxlength="170" placeholder="Search CRA">
                            <datalist id="wb-srch-q-ac"></datalist>
                        </div>
                        <div class="form-group submit">
                            <button type="submit" id="wb-srch-sub" class="btn btn-primary btn-small" name="wb-srch-sub"><span class="glyphicon-search glyphicon"></span><span class="wb-inv">Search CRA</span></button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
        <hr>
        <div class="container">
            <div class="row">
                <div class="col-md-8">
                    <nav class="gcweb-menu" typeof="SiteNavigationElement">
                        <h2 class="wb-inv" id="gcwebMenu">Menu</h2>
                        <button type="button" aria-haspopup="true" aria-expanded="false"><span class="wb-inv">Main </span>Menu <span class="expicon glyphicon glyphicon-chevron-down"></span></button>
                        <ul role="menu" aria-orientation="vertical" data-ajax-replace="https://www.canada.ca/content/dam/canada/sitemenu/sitemenu-v2-en.html"></ul>
                    </nav>
                </div>
                <div class="col-xs-6 col-xs-offset-6 col-md-offset-0 col-md-4">
                    <section id="wb-so">
                        <h2 class="wb-inv">Sign in</h2>
                        <a class="btn btn-primary" href="https://www.canada.ca/en/revenue-agency/services/e-services/cra-login-services.html"><span class="visible-xs">Sign in</span><span class="hidden-xs">CRA sign in</span></a>
                    </section>
                </div>
            </div>
        </div>
        <nav id="wb-bc" property="breadcrumb" aria-labelledby="breadcrumbPosition">
            <h2 id="breadcrumbPosition">You are here:</h2>
            <div class="container">
                <ol class="breadcrumb">
                    <li><a href="https://www.canada.ca/en.html">Canada.ca</a></li>
${frontData.breadcrumbs ? `${frontData.breadcrumbs.map(item => `                    <li><a href="${item.link}">${item.title}</a></li>`).join("")}
                </ol>
            </div>
        </nav>` : ``}
    </header>` : `<div id="def-top">
        <!-- Write closure fall-back static file -->
        <!-- /ROOT/etc/designs/canada/cdts/gcweb/v5_0_5/cdts/static/top-en.html -->
    </div>
    <!-- Write closure template -->
    <script>
        var defTop = document.getElementById("def-top");
        defTop.outerHTML = wet.builder.top({
${frontData.altLangPage ? `            lngLinks: [{
                lang: "fr", 
                href: "${frontData.altLangPage}", 
                text: "Français"
            }], ` : ``}
            customSearch: [{
                action: "https://www.canada.ca/en/revenue-agency/search.html",
                placeholder: "CRA", 
                method: "get", 
            }], 
            breadcrumbs: [{
                    title: "Canada.ca", 
                    href: "https://www.canada.ca/en.html"
                }${frontData.breadcrumbs ? `${frontData.breadcrumbs.map(item => `, {
                title: "${item.title}", 
                href: "${item.link}"
            }`).join(", ")} 
            ]` : ``}
        });
    </script>`}
    <main property="mainContentOfPage" typeof="WebPageElement" class="container">

${frontData.htmlMain}

            <div id="def-preFooter">
                <!-- Write closure fall-back static file -->
                <!-- /ROOT/etc/designs/canada/cdts/gcweb/v5_0_5/cdts/static/preFooter-en.html -->
            </div>
        </main>
        <script>
            var defPreFooter = document.getElementById("def-preFooter");
            defPreFooter.outerHTML = wet.builder.preFooter({
                showShare: false, 
${frontData.feedbackData ? `                    showFeedback: {
                        enabled: true, 
                        theme: "Taxes", 
                        section: "${frontData.title}"
                    }, ` : ``}
${frontData.dateModified ? `                    dateModified: "${frontData.dateModified}"` : ``}
            });
        </script>
        <div id="def-footer">
            <!-- Write closure fall-back static file -->
            <!-- /ROOT/app/cls/WET/gcweb/v5_0_5/cdts/static/footer-en.html -->
        </div>
        <!-- Write closure template -->
        <script>
            var defFooter = document.getElementById("def-footer");
            defFooter.outerHTML = wet.builder.footer({
                exitURL: "#", 
                exitDomains: "#", 
                contextualFooter: {
                    title: "Canada Revenue Agency (CRA)", 
                    links: [{
                        text: "Contact the CRA", 
                        href: "https://www.canada.ca/en/revenue-agency/corporate/contact-information.html"
                    }, {
                        text: "Update your information", 
                        href: "https://www.canada.ca/en/revenue-agency/services/update-information-cra.html"
                    }, {
                        text: "About the CRA", 
                        href: "https://www.canada.ca/en/revenue-agency/corporate/about-canada-revenue-agency-cra.html"
                    }]
                }, 
                privacyLink: {
                    href: "https://www.canada.ca/en/revenue-agency/corporate/privacy-notice.html"
                }
            });
        </script>
        <!-- Write closure template -->
        <script>
            document.write(wet.builder.refFooter({
            }));
        </script>
        <script defer="defer" src="https://wet-boew.github.io/themes-dist/GCWeb/GCWeb/m%C3%A9li-m%C3%A9lo/2025-12-mille-iles.js"></script>
${frontData.script ? `${frontData.script.map(item => `        <script defer="defer" src="${item}"></script>
`).join("")}` : ``}        <!-- START of GitHub only scripts -->
        <script defer="defer" src="https://${frontData.domain}/core-prototype/source/scripts/external-link-detour.js"></script>
        <script defer="defer" src="https://${frontData.domain}/core-prototype/source/scripts/git-dev-options-e.js"></script>
        <script defer="defer" src="https://${frontData.domain}/core-prototype/resources/tools/tinymce/tinymce.min.js"></script>
        <!-- END of GitHub only scripts -->
    </body>
</html>