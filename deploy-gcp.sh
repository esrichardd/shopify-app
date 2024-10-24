gcloud auth activate-service-account --key-file sa.json 
gcloud auth configure-docker --project loggy-initiative
docker build --platform linux/amd64 -t shipty-shopify-app -f Dockerfile .
docker tag shipty-shopify-app gcr.io/loggy-initiative/shipty-shopify-app:latest
docker push gcr.io/loggy-initiative/shipty-shopify-app:latest