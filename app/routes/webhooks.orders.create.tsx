import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { sendPayloadToWebhook } from "app/utils/beefly/send-payload";
import { getShop } from "app/utils/graphql";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, session, topic, payload, admin } =
    await authenticate.webhook(request);

  const { id, name } = await getShop(admin);
  console.log(`Received ${topic} webhook for ${{ id, name }}`);

  await sendPayloadToWebhook("orders/create", {
    shop: { shop, id, name },
    session,
    topic,
    payload,
  });

  return new Response();
};
