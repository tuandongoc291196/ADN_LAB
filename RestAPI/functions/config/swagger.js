const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

let swaggerDocs;

try {
    // Load the YAML documentation file
    const yamlPath = path.join(__dirname, '../docs/swagger-docs.yaml');
    swaggerDocs = YAML.load(yamlPath);

    if (!swaggerDocs) {
        throw new Error("Failed to load YAML documentation");
    }

    console.log("✅ Swagger YAML documentation loaded successfully");

} catch (error) {
    console.error("❌ Error loading Swagger YAML documentation:", error);
    
    // Fallback minimal configuration
    swaggerDocs = {
        openapi: '3.0.0',
        info: {
            title: 'ADN LAB API',
            version: '1.0.0',
            description: 'Error loading full documentation'
        },
        paths: {}
    };
}

module.exports = {
    swaggerUi,
    swaggerDocs
};
