export const settings = {
  iconClusterDistanceFactor: 0.8,
  iconClusterMinDistance: 35,
  iconClusterIcons: [
    [0, 2], // 2 entries
    [2, 1, 2], // 3+ entries
  ],
  icons: [
    { src: "icon1.svg", scale: 1, anchor: [0.5, 1] },
    { src: "icon2.svg", scale: 1, anchor: [0.5, 1] },
    { src: "icon3.svg", scale: 1, anchor: [0.5, 1] },
  ],
  editingEnabled: true,
  stadiaApiKey: null, // Add API key here to use background tiles from Stadia Maps (fall back to OSM on failure)
  useOverrides: true,
  slowModeEnabled: true,
  popupArrowHeight: 10,
  popupArrowWidth: 20,
  popupGap: 5, // gap between popup arrow and the actual map point
};
