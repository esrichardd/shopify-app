FROM node:18-alpine

EXPOSE 8080

WORKDIR /app

ENV NODE_ENV=production
ENV SHOPIFY_API_KEY=af91d7ecd9bbc04982efe007651fba32
ENV SHOPIFY_API_SECRET=9241158f129e7b6eed762c5380a4e93a
ENV SHOPIFY_APP_URL=https://beefly-563442940248.us-central1.run.app
ENV SHOPIFY_SCOPES=read_metaobject_definitions,read_metaobjects,read_orders,write_metaobject_definitions,write_metaobjects,write_orders
ENV SCOPES=read_metaobject_definitions,read_metaobjects,read_orders,write_metaobject_definitions,write_metaobjects,write_orders
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
