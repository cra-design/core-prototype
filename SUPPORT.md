# Support information

> [!NOTE]
> Make sure to use the spacing indicated below or in the page templates as improper spacing and layout of values can cause issues in the how the page is generated

## GCWeb Jekyll template YAML page settings

```yaml
---

# The "#" character can be used to create comments in YAML
# none of the settings are mandatory to include

layout: ["default"]                                # Available layout types: core, default, fluid, no-container, without-h1, application, home, servermesssage, splashpage-en, splashpage-fr

# The following options are available for the layouts core, default, fluid, no-container, without-h1

lang: ["en" | "fr"]                                # Sets the page language
title: "The title of the current page"             # Sets the title and H1 tag
description: "Description of the current page"     # Sets the description metadata
subject: "the subject of the current page"         # Sets the subject metadata
altLangPage: "The page URL"                        # Sets the URL of the alternate language page for the language toggle
auth:                                              # Creates and configures a sign in button
  type: ["signedoff" | "active" | "contextual"]    # Sets the initial state of the sign in button
  label: "Sign in button label"                    # Sets the label of the sign in button
  labelExtended: "Sign in button extended label"   # Sets the extended label of the sign in button
  link: "The page URL"                             # Sets the URL the sign in button takes you to
breadcrumbs:                                       # By default the Canada.ca breadcrumbs is already set
  - title: "The title"                             # The title of the breadcrumb element
    link: "The page URL"                           # The URL of the breadcrumb element
dateIssued: YYYY-MM-DD                             # Sets the date page issued metadata
dateModified: YYYY-MM-DD                           # Sets the date page was last modified
css: "https://domain/your-stylesheet.css"          # Sets the link for custom CSS files you add to your page
script: "https://domain/your-awesome-script.js"    # Sets the link for custom JavaScript files you add to your page
---

<p>HTML Content that will be displayed on the page</p>
```

## Additional GCWeb Jekyll template YAML page settings

```yaml
nositesearch: [true | false]                       # Sets if the site search shows on the page [default: false]
nomenu: [true | false]                             # Sets if the top menu shows on the page [default: false]
noFooterMain: [true | false]                       # Sets if the footer shows on the page [default: false]
noFooterCorporate: [true | false]                  # Sets if the Corporate footer shows on the page [default: false]
noFooterContextual: [true | false]                 # Sets if the Contextual footer shows on the page [default: false]
contextualFooter:                                  # Creates and configures the links for a contextual footer
  title: "Canada Revenue Agency (CRA)"             # Sets the title for the contextual footer area
  links:                                           # Adds a link in the contextual footer
   - text: "Contact the CRA"
     url: "the URL"
pageclass: "page CSS class"                        # Sets CSS class that are in the <body> tag  
creator: "the page creator"                        # Sets the Creator element for the page
privacyUrl: "privacy page URL"                     # Sets the URL for the privacy link in the page footer
termsUrl: "terms and conditions page URL"          # Sets the URL for the terms and conditions link in the page footer

archived: [true | false]                           # Sets if the archived banner is added to the top of the page [default: false]
archiveOverlay: [true | false]                     # 

breadcrumbs: [true | false]                        # Toggles if the breadcrumb is shown [default: true]
overwriteBreadcrumbs: [true | false]               # 

css:                                               # Allows you to add custom CSS to your entire site
  - href: "The CSS file URL"
    integrity: ""
script:                                            # Allows you to add custom script files to your entire site
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
  institution:
  url:

# [default] layout specific settings
parentPage:                                        # Sets the header for the right column secondary menu
  title:
secondarymenu:                                     # Adds a right column secondary menu
  - link:
    title:
    subnav:                                        # Sets a nested section in the right column secondary menu 
     - title:
       link:

# [application] layout specific settings
applicationName: "Canada Revenue Agency (CRA)"    # Sets the title of the bar at the top of the application layout for the page
applicationURL: "https://www.canada.ca/en/revenue-agency.html"   # Sets the URL of link in the bar at the top of the application layout for the page
infoBanner:                                       # Sets a Banner at the top of the page and its elements
  - title:
    message:
    link:
     - href:
       text:
       external:
```

## Site [_config.yml](https://github.com/cra-design/gst-hst-business/blob/main/_config.yml) file options

[//]: # (**************************Test comment*********************************)

```yaml
layout: ["default"]                                # Available layout types: core, default, fluid, no-container, without-h1, application, home, servermesssage, splashpage-en, splashpage-fr
lang: ["en" | "fr"]                                # Sets the page language for the entire site
creator:                                           # Sets the Creator element for all pages on the site
  en: "Canada Revenue Agency"
  fr: "Agence du revenu du Canada"
website: "website URL"                             # Root website used for the site
sitemenu: [true | false]
sitesearch: [true | false]
contextualFooter:                                  # Creates and configures the links for a contextual footer for the entire site
  title: "Canada Revenue Agency (CRA)"
  links:
   - text: "Contact the CRA"
     url: "https://www.canada.ca/en/revenue-agency/corporate/contact-information.html"
privacyUrl: "https://www.canada.ca/en/revenue-agency/corporate/privacy-notice.html"   # Sets the URL for the privacy link in the page footer for the entire site
termsURL: "https://www.canada.ca/en/transparency/terms.html"   # Sets the URL for the terms and conditions link in the page footer for the entire site
```

## Additional Site [_config.yml](https://github.com/cra-design/gst-hst-business/blob/main/_config.yml) file options

```yaml
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
```

## Installation instructions for running GCWebb Jekyll on a local PC 

1. Install Ruby [Ruby Installers for Windows](https://rubyinstaller.org/downloads/)
2. 

```ruby
gem install github-pages
 gem update --system 3.6.6
  gem uninstall fiddle -v 1.1.1
  gem install faraday-retry
 gem install bundler
bundle exec jekyll serve --live reload
```

## Resources

- [User Centered Design Guide](https://design.cra-arc.alpha.canada.ca/en/index.html)
- [GCWeb, the WET-BOEW Canada.ca theme](https://wet-boew.github.io/GCWeb/index-en.html)
- [Jekyll theme for GCWeb](https://github.com/wet-boew/gcweb-jekyll)
- [Web page creation - GCWeb Jekyll \(translated\)](https://wet--boew-github-io.translate.goog/gcweb-jekyll/pages/index-fr.html?_x_tr_sl=fr&_x_tr_tl=en&_x_tr_hl=en-US&_x_tr_pto=wapp)
- [Variables | Jekyll](https://jekyllrb.com/docs/variables/)
- [Testing your GitHub Pages site locally with Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll)
- [Jekyll Windows installation video](https://www.youtube.com/watch?v=LfP7Y9Ja6Qc)
- [Ruby Installers for Windows](https://rubyinstaller.org/downloads/)
- [Learn YAML in Y minutes](https://learnxinyminutes.com/docs/yaml/)
