FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy project SQL Server Database
COPY /TicketsSupport.Database/ .

#generate dacpac
RUN dotnet build Database.sqlproj.prod /p:NetCoreBuild=true -o ./

FROM mcr.microsoft.com/mssql/server:2022-latest as publish
WORKDIR /app

# Elevate to root to install required packages
USER root

# Configure external build arguments to allow configurability.
ARG DBNAME=Database
ARG PASSWORD

# Configure the required environmental variables
ENV ACCEPT_EULA=Y
ENV SA_PASSWORD=$PASSWORD

# Copy DACPAC From build
COPY --from=build /app/Database.sqlproj.dacpac /tmp/database.dacpac

# Install Unzip and libunwind8
RUN apt-get update \
    && apt-get install unzip libunwind8 -y
	
# Install SQLPackage for Linux and make it executable
RUN wget -progress=bar:force -q -O sqlpackage.zip https://aka.ms/sqlpackage-linux \
    && unzip -qq sqlpackage.zip -d /opt/sqlpackage  \
    && chmod a+x /opt/sqlpackage/sqlpackage 

RUN echo "#!/bin/bash \n \
# Iniciar SQL Server \n \
/opt/mssql/bin/sqlservr \n \
# Esperar hasta que SQL Server esté listo \n \
until /opt/mssql/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -Q "SELECT @@VERSION" &> /dev/null \n \
do \n \
    echo "Waiting for SQL Server to be ready..." \n \
    sleep 5 \n \
done \n \
# Verificar si el archivo database.dacpac existe \n \
if [ -f "/tmp/database.dacpac" ]; then \n \
    echo "Applying database changes..." \n \
    /opt/sqlpackage/sqlpackage /a:Publish /tsn:. /tdn:${DBNAME} /tu:sa /tp:$SA_PASSWORD /sf:/tmp/database.dacpac /tec:Mandatory /ttsc:True \n \
    rm /tmp/database.dacpac \n \
fi" > /app/deploy.sh && chmod +x /app/deploy.sh	

# Expone el puerto predeterminado de SQL Server
EXPOSE 1433

ENTRYPOINT ["/app/deploy.sh"]