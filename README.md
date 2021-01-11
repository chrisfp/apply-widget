# Streetcampaign Register Widget

This is an embeddable form widget for submitting job applications to streetcampaign. The widget can be embedded to any html element by both setting the element's id to `id="streetcampaign-apply-widget"` and loading the script using `<script src="https://github.com/chrisfp/apply-widget/releases/latest/download/apply-widget.min.js"></script>`. Note: you also need to load the Google font "Roboto" using `<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"/>`.

In order to specify the agency/organization/company the form should submit the job applications to, you need to set the company id on the widget element as follows `data-company-id="..."`.

Example for Apollo Dialogmarketing GmbH:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />streetcampaign-apply-widget
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
    />
    <title>Example page using streetcampaign register widget script</title>
  </head>
  <body>
    <div id="streetcampaign-apply-widget" data-company-id="7PexgwdKnT8NIN50dtFt"></div>
    <script src="https://github.com/chrisfp/apply-widget/releases/latest/download/apply-widget.min.js"></script>
  </body>
</html>
```