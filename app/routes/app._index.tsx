import { useState } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Button,
  BlockStack,
  TextField,
  Form,
  Banner,
  Text,
  Thumbnail,
} from "@shopify/polaris";
import { getShop } from "app/utils/graphql";
import { fetchExternalStore } from "app/utils/beefly";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const { id, name } = await getShop(admin);

  const activeStoreData = await fetchExternalStore(id);
  return createResponse(name, id, activeStoreData);
};

const createResponse = (shop: string, id: string, activeStoreData: any) => {
  return json({
    registered: !!activeStoreData,
    store: shop,
    id: id,
    company: activeStoreData?.companyId || "",
    email: activeStoreData?.email || "",
    token: activeStoreData?.companyId || "",
  });
};

export default function Index() {
  const settings = useLoaderData<{
    store: string;
    id: string;
    registered: boolean;
    company: string;
    email: string;
    token: string;
  }>();
  const [isConfigured, setIsConfigured] = useState(settings.registered);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    token: { value: "", error: "" },
    email: { value: "", error: "" },
    company: { value: "", error: "" },
  });

  const handleSubmit = async () => {
    if (!validateFields()) return;

    setIsSubmitting(true);

    const formData = mapFields();
    const success = await sendFormData(formData);

    showNotification(success);
  };

  const validateFields = () => {
    const errors = {
      token: formState.token.value ? "" : "Este campo es requerido",
      email: formState.email.value ? "" : "Este campo es requerido",
      company: formState.company.value ? "" : "Este campo es requerido",
    };

    setFormState({
      ...formState,
      token: { ...formState.token, error: errors.token },
      email: { ...formState.email, error: errors.email },
      company: { ...formState.company, error: errors.company },
    });

    return !errors.token && !errors.email && !errors.company;
  };

  const mapFields = () => ({
    ...settings,
    email: formState.email.value,
    token: formState.token.value,
    company: formState.company.value,
  });

  const sendFormData = async (data: any) => {
    try {
      const result = await fetch("/beefly", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return result.ok;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      return false;
    }
  };

  const showNotification = (success: boolean) => {
    if (success) {
      shopify.toast.show("Tienda configurada correctamente", {
        duration: 5000,
      });

      setIsConfigured(true);
    } else {
      shopify.toast.show("Error al configurar la tienda", {
        duration: 5000,
        isError: true,
      });
    }

    setIsSubmitting(false);
  };

  return (
    <Page>
      <BlockStack gap="500">
        <BlockStack inlineAlign="center" gap="200">
          <Thumbnail
            alt="Beefly"
            size="large"
            source={
              "https://shipty.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ficon.ebc91005.jpeg&w=384&q=75"
            }
          />
          <Text variant="headingXl" as="h1" alignment="center">
            Beefly Onboarding
          </Text>
        </BlockStack>
        <Layout>
          <Layout.Section>
            <Card roundedAbove="sm">
              <Form onSubmit={handleSubmit}>
                <BlockStack gap="400">
                  <TextField
                    label="Nombre de tienda"
                    autoComplete="off"
                    value={settings.store}
                  />
                  <TextField
                    label="Id de Tienda"
                    autoComplete="off"
                    value={settings.id}
                  />
                  <TextField
                    label="Id de Compañía"
                    autoComplete="off"
                    value={settings.company || formState.company.value}
                    error={formState.company.error}
                    onChange={(value) =>
                      setFormState({
                        ...formState,
                        company: { value, error: "" },
                      })
                    }
                  />
                  <TextField
                    label="Email"
                    autoComplete=""
                    value={settings.email || formState.email.value}
                    type="email"
                    error={formState.email.error}
                    onChange={(value) =>
                      setFormState({
                        ...formState,
                        email: { value, error: "" },
                      })
                    }
                  />
                  <TextField
                    label="Token de Acceso"
                    autoComplete="off"
                    type={settings.registered ? "password" : "text"}
                    value={settings.token || formState.token.value}
                    error={formState.token.error}
                    onChange={(value) =>
                      setFormState({
                        ...formState,
                        token: { value, error: "" },
                      })
                    }
                  />
                  {isConfigured ? (
                    <Banner
                      title="Tu tienda ya esta configurada."
                      tone="success"
                    />
                  ) : (
                    <Button submit={true} disabled={isSubmitting}>
                      Guardar
                    </Button>
                  )}
                </BlockStack>
              </Form>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
