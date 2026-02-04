# Support information

> [!NOTE]
> Make sure to indent with spaces as used below or as shown in the templates as improper spacing and layout of values and variables can cause issues in the format and look of how a page is generated.

## On this page

- [Basic GCWeb setup instructions](basic-gcweb-setup-instructions)
- [Page template options](#page-template-options)
- [Custom GitHub options](#custom-github-options)
- [GCWeb Jekyll template YAML page settings](#gcweb-jekyll-template-yaml-page-settings)
- [Additional GCWeb Jekyll template YAML page settings](#additional-gcweb-jekyll-template-yaml-page-settings)
- [Site _config.yml file options](#site-_config.yml-file-options)
- [Additional Site _config.yml file options](#additional-site-_config.yml-file-options)
- [Custom YAML page setting options](#custom-yaml-page-setting-options)
- [Custom YAML site _config.yml file options](#custom-yaml-site-_config.yml-file-options)
- [Installation instructions for running GCWeb Jekyll on a local PC](#installation-instructions-for-running-gcweb-jekyll-on-a-local-pc)
- [Resources](#resources)

## Basic GCWeb setup instructions

For the GCWeb/Jekyll setup to function a `_config.yml` file must saved at the repositories root. Examples: [GCWeb _config.yml](https://github.com/wet-boew/gcweb-jekyll/blob/master/_config.yml), [core-prototype _config.yml](https://github.com/cra-design/core-prototype/blob/main/_config.yml)

## Page template options

- The `Edit button` on the banner toggles an instance **TinyMCE** on and off allowing editing of the live page **Note:** Any changes you save with this method are only saved for yourself so if you want to make any permanent changes you'll still need to update those via GitHub
- The `GitHub button` on the banner will take you to the the source page on GitHub
- All pages links and forms that direct outside of the repository to will automatically be replaced with links to the **exit intent page**

## Custom GitHub options

- The data attribute `data-exit="false"` can be used on `<a>` and `<form>` tags directed outside of the GitHub domain so that replacement links are not generated to direct them automatically through the **exit intent page**
- Link overrides can be added to the [exit-link-excludes.json](https://github.com/cra-design/gst-hst-business/blob/main/_data/exitlinkexcludes.json) file. If there is only an `origin` link and no `destination` link then all occurrences of the link to that page will be excluded from redirects to the **exit intent page**. If there is both an `origin` link and a `destination` link then all occurrences of the `origin` link will be redirected to the `destination` page

## GCWeb Jekyll template YAML Front Matter page settings

```yaml
---

# The "#" character can be used to create comments in YAML
# none of the settings are mandatory to include

layout: ["default"]                                # Available layout types: core, default, fluid, gcds, no-container, without-h1, application, home, servermesssage, splashpage-en, splashpage-fr

# The following options are available for the layouts core, default, fluid, gcds, no-container, without-h1

title: "The title of the current page"             # Sets the title and H1 tag
description: "Description of the current page"     # Sets the description metadata
subject: "The subject of the current page"         # Sets the subject metadata
altLangPage: "The page URL"                        # Sets the URL of the alternate language page for the language toggle
auth:                                              # Creates and configures a sign in button
  type: ["signedoff" | "active" | "contextual"]    # Sets the initial state of the sign in button
  label: "Sign in button label"                    # Sets the label of the sign in button
  labelExtended: "Sign in button extended label"   # Sets the extended label of the sign in button
  link: "The page URL"                             # Sets the URL the sign in button takes you to
breadcrumbs:                                       # [Method 1] - By default the Canada.ca breadcrumbs is already set
  - title: "The title"                             # The title of the breadcrumb element
    link: "The page URL"                           # The URL of the breadcrumb element
dateIssued: YYYY-MM-DD                             # Sets the date page issued metadata
dateModified: YYYY-MM-DD                           # Sets the date page was last modified
---

<p>HTML Content that will be displayed on the page</p>
```

## Additional GCWeb Jekyll template YAML Front Matter page settings

```yaml
---
nositesearch: [true | false]                       # Sets if the site search shows on the page [default: false]
nomenu: [true | false]                             # Sets if the top menu shows on the page [default: false]
noFooterMain: [true | false]                       # Sets if the footer shows on the page [default: false]
noFooterCorporate: [true | false]                  # Sets if the Corporate footer shows on the page [default: false]
noFooterContextual: [true | false]                 # Sets if the Contextual footer shows on the page [default: false]

lang: ["en" | "fr"]                                # Sets the page language
contextualFooter:                                  # Creates and configures the links for a contextual footer
  title: "Canada Revenue Agency (CRA)"             # Sets the title for the contextual footer area
  links:                                           # Adds a link in the contextual footer
   - text: "The CRA footer link text"
     url: "The CRA footer URL"
pageclass: "Page CSS class"                        # Sets CSS class that are in the <body> tag
creator: "The page creator"                        # Sets the creator metadata
privacyUrl: "Privacy page URL"                     # Sets the URL for the privacy link in the page footer
termsUrl: "Terms and conditions page URL"          # Sets the URL for the terms and conditions link in the page footer
sitemenuPath: https://www.canada.ca/content/dam/canada/sitemenu/sitemenu-v2-en.html # Sets the path of the ajaxed Site Menu

archived: [true | false]                           # Sets if the archived banner is added to the top of the page [default: false]
archiveOverlay: [true | false]                     #

breadcrumbs: [true | false]                        # [Method 2] - Toggles if the breadcrumb is shown [default: true]
overwriteBreadcrumbs: [true | false]               #

css: "https://domain/your-stylesheet.css"          # [Method 1] - Sets the link for custom CSS files you add to your page
css:                                               # [Method 2] - Allows you to add custom CSS to your entire site
  - href: "The CSS file URL"
    integrity: ""

script: "https://domain/your-awesome-script.js"    # [Method 1] - Sets the link for custom JavaScript files you add to your page
script:                                            # [Method 2] - Allows you to add custom script files to your entire site
  - src: "The script file URL"
    type: "text/javascript"
    integrity: ""

# Layout specific settings:

# [application/default/fluid/home/no-container/without-h1] layout specific settings
feedback: [true | false]                           # Sets if the page feedback item is shown at the bottom of the page
feedbackData:                                      # Sets the values for the feedback section at the bottom of the page
  section: "The title of the current page"         # This value sets what to identify the page as in the feedback section for when feedback is sent
  theme: "Taxes"
contributors:                                      # Sets the contributors for the page
  - name: ""
    url: ""
feedbackContact:
  - link: ""
    url: ""
feedbackFallback:
feedbackPath:

# [default/fluid] layout specific settings
sectionTitle: "Section title for the page"         # Sets the section title above the H1 tag
titleH1: "The header of the current page"          # Sets the H1 tag (title over rides this value)
byline:
  institution: ""
  url: ""

# [default] layout specific settings
parentPage:                                        # Sets the header for the right column secondary menu
  title: ""
secondarymenu:                                     # Adds a right column secondary menu
  - link: ""
    title: ""
    subnav:                                        # Sets a nested section in the right column secondary menu
     - title: ""
       link: ""

# [application] layout specific settings
applicationName: "Canada Revenue Agency (CRA)"    # Sets the title of the bar at the top of the application layout for the page
applicationURL: "https://www.canada.ca/en/revenue-agency.html"   # Sets the URL of link in the bar at the top of the application layout for the page
infoBanner:                                       # Sets a Banner at the top of the page and its elements
  - title: ""
    message: ""
    link:
     - href: ""
       text: ""
       external: ""
---
```

## Custom YAML Front Matter page setting options

```yaml
---
testBanner: [true | false]                        # Toggles if the testing site only banner shows for a page (deafult: true)
notedlinks:                                        # Configures and adds links of your choice to the testing site only banner for a page
  - title: "The link title"
    link: "The link URL"
keywords: ""                                      # Displays these keywords to be associated to the page
---
```

## Site [_config.yml](https://github.com/cra-design/gst-hst-business/blob/main/_config.yml) file options

```yaml
---
layout: ["default"]                                # Available layout types: core, default, fluid, no-container, without-h1, application, home, servermesssage, splashpage-en, splashpage-fr
lang: ["en" | "fr"]                                # Sets the page language for the entire site
creator:                                           # Sets the creator metada attribute for all pages on the site
  en: "Canada Revenue Agency"
  fr: "Agence du revenu du Canada"
website: "Website URL"                             # Root website used for the site
sitemenu: [true | false]
sitesearch: [true | false]
contextualFooter:                                  # Creates and configures the links for a contextual footer for the entire site
  title: "Canada Revenue Agency (CRA)"
  links:
   - text: "Contact the CRA"
     url: "https://www.canada.ca/en/revenue-agency/corporate/contact-information.html"
privacyUrl: "https://www.canada.ca/en/revenue-agency/corporate/privacy-notice.html"   # Sets the URL for the privacy link in the page footer for the entire site
termsURL: "https://www.canada.ca/en/transparency/terms.html"   # Sets the URL for the terms and conditions link in the page footer for the entire site
---
```

## Additional site [_config.yml](https://github.com/cra-design/gst-hst-business/blob/main/_config.yml) file options

```yaml
---
description: "Description of the current page"     # Sets the description metadata for the entire site
breadcrumbs:                                       # By default the Canada.ca breadcrumbs is already set
  - title: "The title"                             # The title of the breadcrumb element
    link: "The page URL"                           # The URL of the breadcrumb element
share: [true | false]

# Layout specific settings:

# [application/default/fluid/home/no-container/without-h1] layout specific settings
feedback: [true | false]                           # Sets if the page feedback item is shown at the bottom of every page for the site
feedbackData:                                      # Sets the values for the feedback section at the bottom of every page for the site
  theme: "Taxes"
feedbackPath: "https://www.canada.ca/etc/designs/canada/wet-boew/assets/feedback/page-feedback-en.html"

# [application] layout specific settings
applicationName: "Canada Revenue Agency (CRA)"    # Sets the title of the bar at the top of the application layout for all pages on the site
applicationURL: "https://www.canada.ca/en/revenue-agency.html"   # Sets the URL of link in the bar at the top of the application layout for all pages on the site
---
```

## Custom YAML site [_config.yml](https://github.com/cra-design/gst-hst-business/blob/main/_config.yml) file options

```yaml
---
developerOptions: [true | false]                   # Turns the developer options on/off for all pages (Edit button, GitHub button, custom banner links, exit page leave site button)
devOptionsLocStore: "gitCRATemplateDevOptions"     # Sets the localStorage key name that is used to store the boolean value trigger if the developer options are on/off
testBanner: [true | false]                         # Toggles the site wide banner off and on for the site

exitByURL: [true | false]                          # Toggles if the exit page uses the developed method or if it uses the WET Exit plugin. Default is true
exitPage:                                          # Identifies the links to the exit intent page used for link generation on all pages
  en: "English exit intent page URL"
  fr: "French exit intent page URL"

externalOrigin: "https://domain"                   # The domain will be prepended to all links on all pages where the link starts with "/"
modifiedLinkList: "JSON link file URL"             # The path and filename of a JSON file with links that over ride the exit links and redirect the designated URLs to a specified page
relativeExternalLinks: [true | false]              # Identifies whether links to the exit intent page will be generated from relative links where the link starts with "/"
---
```

## Installation instructions for running GCWeb Jekyll on a local (personal) PC

1. [Video instructions for all of step 1-2](https://www.youtube.com/watch?v=LfP7Y9Ja6Qc) Download and install Ruby. You can find a version to download through the [Download Ruby](https://www.ruby-lang.org/en/downloads/) page
   1. Install Ruby with all the defaults checked and make sure `Run 'ridk install' to install MSYS2 and development toolchain.` is checked.  This will open a command prompt install dialog
   2. Follow the prompts and install **all three** options that are shown
      1. First install `1 - MSYS2 base installalation`
      2. then install `2 - MSYS2 system update (optional)`
      3. and finally install `3 - MSYS2 and MINGW development toolchain`
   3. Open the `Command prompt/Terminal/Powershell` and enter `ruby -v` to verify that **ruby** is installed
   4. At the `Command prompt/Terminal/Powershell` and enter `gem -v` to verify that **gem** is installed
2. At the `Command prompt/Terminal/Powershell` and enter `gem install jekyll bundler` after it has completed enter `jekyll -v` to verify that **Jekyll** is installed
3. At the `Command prompt/Terminal/Powershell` and enter `gem install GitHub-pages` to install GitHub page support
4. Update any older elements that you may have been notified of in the `Command prompt/Terminal/Powershell` when you did the various `gem install` commands (e.g. `gem update --system 3.6.7`)
5. At the the `Command prompt/Terminal/Powershell` enter `bundle exec jekyll serve --live reload`. This should run Jekyll, generate your site, and start the local site server
   1. **Note**: a `gemfile` is required in the local GitHub repository to run the jekyll server.  This gemfile should contain the following line: `gem "github-pages", group: :jekyll_plugins`
6. In your browser go to `https://localhost:4000/github-workspace-name/` and you should see your a fully generated version of your site

[//]: # (**************************Test comment*********************************)
[//]: # (At the `Command prompt/Terminal/Powershell` and enter `gem install bundler`)
[//]: # (https://www.youtube.com/watch?v=fV01b0duZwU&t=242s)

## Resources

- [User Centered Design Guide](https://design.cra-arc.alpha.canada.ca/en/index.html)
- [GCWeb, the WET-BOEW Canada.ca theme](https://wet-boew.github.io/GCWeb/index-en.html)
- [Centrally Deployed Templates Solutions \(CDTS\) - Internet](https://cenw-wscoe.github.io/sgdc-cdts/docs/internet-nodocwrite-en.html)
- [Jekyll theme for GCWeb](https://github.com/wet-boew/gcweb-jekyll)
- [Web page creation - GCWeb Jekyll \(translated\)](https://wet--boew-github-io.translate.goog/gcweb-jekyll/pages/index-fr.html?_x_tr_sl=fr&_x_tr_tl=en&_x_tr_hl=en-US&_x_tr_pto=wapp)
- [Variables | Jekyll](https://jekyllrb.com/docs/variables/)
- [Testing your GitHub Pages site locally with Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll)
- [Learn YAML in Y minutes](https://learnxinyminutes.com/docs/yaml/)
- [Liquid template language](https://shopify.github.io/liquid/basics/introduction/)
- [Liquid | Jekyll](https://jekyllrb.com/docs/liquid/)
- [GitHub Flavored Markdown Spec](https://github.github.com/gfm/)
- [Mermaid Markdown documentation](https://mermaid.js.org/intro/getting-started.html)
- [GitHub Help](https://help.github.com)
