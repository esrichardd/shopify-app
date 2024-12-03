FROM node:18-alpine

EXPOSE 8080

WORKDIR /app

ENV NODE_ENV=production

#ZEPHYRA
#ENV SHOPIFY_API_KEY=e746948a2d94d430b9fd81371d8e85d9
#ENV SHOPIFY_API_SECRET=2acb4a85d04e22e7b7fd9367286ef118

#BRISK
ENV SHOPIFY_API_KEY=95d258e5a1be50ca5c56b8099e1dbb97
ENV SHOPIFY_API_SECRET=9f87a9bb0c2d263c965cce0768fa5329

ENV SCOPES=read_metaobject_definitions,read_metaobjects,read_orders,write_metaobject_definitions,write_metaobjects,write_orders


ENV SHOPIFY_APP_URL=https://beefly-brisk-app-563442940248.us-central1.run.app
ENV SHOPIFY_SCOPES=read_metaobject_definitions,read_metaobjects,read_orders,write_metaobject_definitions,write_metaobjects,write_orders
ENV EXTERNAL_CORE_URL=https://shipty-core-ms-bvihbxanma-uc.a.run.app
ENV EXTERNAL_ADAPTER_URL=https://beefly-shopify-adapter-ms-bvihbxanma-uc.a.run.app


COPY package.json package-lock.json* ./

RUN npm ci --omit=dev && npm cache clean --force
# Remove CLI packages since we don't need them in production by default.
# Remove this line if you want to run CLI commands in your container.
RUN npm remove @shopify/cli

COPY . .

RUN npm run build

CMD ["npm", "run", "docker-start"]
