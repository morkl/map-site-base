export async function getData() {
  const response = await fetch("/data.json");
  return (await response.json()).data;
}
