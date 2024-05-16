# Use Microsoft's official .NET 8.0 ASP.NET runtime image as the base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base

# Set 'app' as the user for the container
USER app

# Set '/app' as the working directory within the container
WORKDIR /app

# Expose ports 8080 and 8081 for the application
EXPOSE 8080
EXPOSE 8081

# Use Microsoft's official .NET 8.0 SDK image to install Node.js
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS with-node

# Update the package lists for upgrades for packages that need upgrading, as well as new packages that have just come to the repositories
RUN apt-get update

# Install curl which is required to install Node.js
RUN apt-get install curl

# Download and run the NodeSource installer (for Node.js v20)
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash

# Install Node.js
RUN apt-get -y install nodejs

# Use the 'with-node' image to build the application
FROM with-node AS build

# Set '/src' as the working directory within the container
WORKDIR /src

# Define the build configuration
ARG BUILD_CONFIGURATION=Release

# Copy the TicketsSupport.WebApi project file into the container
COPY ["TicketsSupport.WebApi/TicketsSupport.WebApi.csproj", "TicketsSupport.WebApi/"]

# Restore the .NET packages required for the application
RUN dotnet restore "./TicketsSupport.WebApi/TicketsSupport.WebApi.csproj"

# Copy the rest of the application source code into the container
COPY . .

# Change the working directory to the TicketsSupport.WebApi directory
WORKDIR "/src/TicketsSupport.WebApi"

# Build the application
RUN dotnet build "./TicketsSupport.WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Use the 'build' image to publish the application
FROM build AS publish

# Define the build configuration
ARG BUILD_CONFIGURATION=Release

# Publish the application
RUN dotnet publish "./TicketsSupport.WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Use the 'base' image for the final image
FROM base AS final

# Set '/app' as the working directory within the container
WORKDIR /app

# Copy the published application into the container
COPY --from=publish /app/publish .
COPY /TicketsSupport.ApplicationCore/EmailTemplates/html /TicketsSupport.ApplicationCore/EmailTemplates/html

# Set the entry point for the container
ENTRYPOINT ["dotnet", "TicketsSupport.WebApi.dll"]
