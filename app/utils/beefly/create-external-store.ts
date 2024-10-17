export const createExternalStore = async (
  body: Record<string, string | number | boolean>,
) => {
  const formattedBody = JSON.stringify({
    id: body.id,
    name: body.store,
    email: body.email,
    notify: true,
    companyId: body.company,
    origin: "SHOPIFY",
    credentials: {
      shopifyCredentialsConfig: {
        accessToken: body.token,
      },
    },
  });

  const result = await fetch(`${process.env.EXTERNAL_URL}/shopify/stores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: formattedBody,
  });

  if (!result.ok) {
    console.log(`Error creating external store ${formattedBody}`);
    throw result;
  }

  const data = await result.json();
  return data || null;
};
