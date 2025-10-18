# Use the official .NET 8 SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files and restore dependencies
COPY FirstTryRequire/*.csproj ./FirstTryRequire/
RUN dotnet restore FirstTryRequire/FirstTryRequire.csproj

# Copy the rest of the source code
COPY FirstTryRequire/ ./FirstTryRequire/

# Build the application
RUN dotnet build FirstTryRequire/FirstTryRequire.csproj -c Release -o /app/build

# Publish the application
RUN dotnet publish FirstTryRequire/FirstTryRequire.csproj -c Release -o /app/publish

# Use the official .NET 8 runtime image for running
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy the published application from the build stage
COPY --from=build /app/publish .

# Expose ports
EXPOSE 5000
EXPOSE 5001

# Set environment variables
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Docker

# Start the application
ENTRYPOINT ["dotnet", "FirstTryRequire.dll"]
