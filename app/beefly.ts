// routes/api/beefly.tsx

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { createExternalStore } from "app/utils/beefly";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response(JSON.stringify({ registered: true }), {
    status: 200,
  });

  return response;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.json();

  const result = await createExternalStore(formData);
  const response = new Response(JSON.stringify(result.statusText), {
    status: result.status,
  });

  return response;
};
