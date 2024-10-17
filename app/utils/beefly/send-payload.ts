export const sendPayloadToWebhook = async (
  controller: string,
  payload: Record<string, unknown>,
) => {
  const baseurl = `${process.env.EXTERNAL_URL}/webhooks/`;
  try {
    const response = await fetch(`${baseurl + controller}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-store": "xstore",
        "x-company-id": "loggy-cl",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error sending payload to webhook: ${controller} `, error);
  }
};
