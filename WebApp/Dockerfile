FROM mcr.microsoft.com/dotnet/sdk:8.0 AS cert-gen
WORKDIR /app

# Create folder
RUN mkdir ssl

# Generate cert and key
WORKDIR app/ssl
RUN dotnet dev-certs https --export-path /app/ssl/cert.pem --format Pem --no-password

FROM node:20.11.1 AS prod
WORKDIR /app

#CONFIGURATION
EXPOSE 8082

#COPY CERT AND KEY
COPY --from=cert-gen /app/ssl/cert.pem /app/ssl/cert.pem
COPY --from=cert-gen /app/ssl/cert.key /app/ssl/cert.key

#INSTALL PACKAGES
COPY ["TicketsSupport.WebApp/package.json", "/app"]
COPY ["TicketsSupport.WebApp/package-lock.json", "/app"]
RUN npm install

#COPY PROJECT AND BUILD
COPY TicketsSupport.WebApp/ .

CMD ["npm", "run", "prod"]