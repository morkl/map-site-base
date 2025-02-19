# Map thing 🗺️

This is a base project for a site to showcase photos in a map.

Feel free to fork and adapt for your own purposes!

Demo: https://map-site-base.pages.dev/

## Customizing

Edit `src/Intro/Intro.jsx`, `src/ShowEntry/EntryHeader.jsx`, `src/ShowEntry/EntryContents.jsx` and their corresponding
stylesheets to change the contents and layout of the intro/welcome screen and the entry popups.

### Functions in src/Customize

| Function           | Description                                                           |
|--------------------|-----------------------------------------------------------------------|
| getData            | Get entries - by default they are fetched from data.json              |
| getFeatures        | Create OpenLayers features from the entries.                          |
| getIconSize        | Get map icon sizes based on the current resolution/zoom level         |
| getImageFullUrl    | Get the URL of the full-sized image                                   |
| getImagePreviewUrl | Get the URL of a preview-sized image                                  |
| getOverrides       | Get overrides - by default they are fetched from overrides.json       |
| getUniqueId        | Get or create a string that can be used to identify a specific entry. |

### Parameters in src/Customize/settings.js

| Setting                   | Description                                                                                                             |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------|
| iconClusterDistanceFactor | Fudge factor for cluster distance                                                                                       |
| iconClusterMinDistance    | Minimum distance between icon before they get clustered together                                                        |
| iconClusterIcons          | Which icons (indices from the icons list) are used for clusters of 2 and 3+ entries                                     |
| icons                     | List of icons with `src`, `scale` and `anchor` (`[0,0]` is top left, `[1,1]` is bottom right).                          |
| editingEnabled            | If `true`, the fugly override editing mode can be activated                                                             |
| stadiaApiKey              | API key for Stadia Maps                                                                                                 |
| useOverrides              | If `true`, coordinate overrides are fetched at startup and applied in runtime.                                          |
| slowModeEnabled           | If `true`, shows a button the toggle a slow mode where image load times are artificially extended for testing purposes. |
| popupArrowHeight          | The height of the arrow pointing from entry popups to the entry location.                                               |
| popupArrowWidth           | The width of the arrow pointing from entry popups to the entry location.                                                |
| popupGap                  | The distance between the top of the arrow pointing from entry popups to the entry location and the location itself.     |

## Overrides editor

If `editingEnabled` is `true`, you can enter editing mode by pressing the edit button in the toolbar.
Select an entry in the map and drag it to move it around.

The right panel shows the currently selected entry, the current overrides, and the full data with the overrides applied.
