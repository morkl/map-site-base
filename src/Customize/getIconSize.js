export function getIconSize(resolution) {
  return resolution < 200
    ? 75
    : resolution < 500
      ? 50
      : resolution < 1000
        ? 35
        : 25;
}
