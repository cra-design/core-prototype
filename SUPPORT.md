# Support information

## GCWeb Jekyll page template example

```yaml
---
layout: [default]                                  # Available: core, default, fluid, layout-home, layout-servermesssage, layout-splashpage, no-container, without-h1
title: "The title of the current page"             # This value will set the title and h1 tag
sectionTitle: "Section title for the page"         # This value will set the section title above the h1 tag
titleH1: "The header of the current page"          # This value will set the h1 tag (title over rides)
lang: [en | fr]                                    # Either "en" or "fr"
description: "Description of the current page"     # Optional. Metadata description
subject: "the subject of the current page"         # Optional. Metadata subject
auth:
  type: [signedoff | active | contextual]          # Optional. Creates and configures a sign in button
  label: "Sign in button label"                    # Label of the sign in button
  labelExtended: "Sign in button extended label"   # Extended label of the sign in button
  link: "The url"                                  # link of the sign in button
altLangPage: "The url"                             # Optional. Use the url of the alternate language page to display the language toggle
dateModified: YYYY-MM-DD                           # ISO date
dateIssued: YYYY-MM-DD                             # Optional. ISO date
breadcrumbs:                                       # By default the Canada.ca breadcrumbs is already set
  - title: "The title"
    link: "The url"
css: "https://domain.ca/your-stylesheet.css"       # Optional. You can add custom css to your page
script: "https://domain.ca/your-awesome-script.js" # Optional. You can add custom javascript to your page
---

<p>Content that would be displayed on the page</p>
```

## Resources

- [User Centered Design Guide](https://design.cra-arc.alpha.canada.ca/en/index.html)
- [GCWeb, the WET-BOEW Canada.ca theme](https://wet-boew.github.io/GCWeb/index-en.html)
- [Jekyll theme for GCWeb](https://github.com/wet-boew/gcweb-jekyll)
- [Testing your GitHub Pages site locally with Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll)
- [Learn YAML in Y minutes](https://learnxinyminutes.com/docs/yaml/)
