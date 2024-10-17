import type { Session } from "@shopify/shopify-api";

interface Payload {
  shop: {
    id: string;
    name: string;
    shop: string;
  };
  topic: string;
  session: Session | undefined;
  payload: Record<string, any>;
}

export const sendPayloadToWebhook = async (
  controller: string,
  payload: Payload,
) => {
  const baseurl = `${process.env.EXTERNAL_ADAPTER_URL}/webhooks/`;
  const {
    shop: { id, name },
  } = payload;

  try {
    const response = await fetch(`${baseurl + controller}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-store": name,
        "x-company-id": id,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error sending payload to webhook: ${controller} `, error);
  }
};
