export const getShop = async (admin: any) => {
  const storeOnDb = await admin.graphql(
    `#graphql
      query {
        shop {
          id
          name
          myshopifyDomain
          currencyCode
        }
      }`,
  );

  const {
    data: {
      shop: { id, name, myshopifyDomain },
    },
  } = await storeOnDb.json();

  return { id: formatId(id), name, myshopifyDomain };
};

const formatId = (id: string) => {
  return id.split("/").pop() || "";
};
