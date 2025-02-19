export async function getOverrides() {
  const response = await fetch("/overrides.json");
  return await response.json();
}
