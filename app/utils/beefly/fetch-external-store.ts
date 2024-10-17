export const fetchExternalStore = async (storeId: string) => {
  const url = `${process.env.EXTERNAL_URL}/shopify/stores/${storeId}`;
  console.log(url);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.log(`Error consulting external store ${storeId}`);
    return null;
  }

  const data = await response.json();
  return data;
};
