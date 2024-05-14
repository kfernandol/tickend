FROM node:20.11.1 AS prod
WORKDIR /app

#CONFIGURATION
EXPOSE 8082

#INSTALL PACKAGES
COPY ["TicketsSupport.WebApp/package.json", "/app"]
COPY ["TicketsSupport.WebApp/package-lock.json", "/app"]
RUN npm install

#COPY PROJECT AND BUILD
COPY TicketsSupport.WebApp/ .

CMD ["npm", "run", "prod"]