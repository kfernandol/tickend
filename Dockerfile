#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8090
EXPOSE 8091

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS with-node
RUN apt-get update
RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash
RUN apt-get -y install nodejs


FROM with-node AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["WebApi/TicketsSupport.WebApi/TicketsSupport.WebApi.csproj", "WebApi/TicketsSupport.WebApi/"]
COPY ["WebApp/TicketsSupport.WebApp/TicketsSupport.WebApp.esproj", "WebApp/TicketsSupport.WebApp/"]
RUN dotnet restore "./WebApi/TicketsSupport.WebApi/TicketsSupport.WebApi.csproj"
COPY . .
WORKDIR "/src/WebApi/TicketsSupport.WebApi"
RUN dotnet build "./TicketsSupport.WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./TicketsSupport.WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TicketsSupport.WebApi.dll"]
