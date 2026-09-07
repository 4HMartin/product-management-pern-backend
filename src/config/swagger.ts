import swaggerJSDoc from "swagger-jsdoc";
import {SwaggerUiOptions} from "swagger-ui-express";

const options: swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.2',
        tags: [
            {
                name: "Products",
                description: "API operations related to products"
            }
        ],
        info: {
            title: "REST API Node.js / Express / TypeScript",
            version: "1.0.0",
            describe: "API Docs for Products"
        },
    },
    apis: ["./src/router.ts"]
}

const swaggerSpec = swaggerJSDoc(options)

// CUSTOM STYLES
const swaggerUiOptions: SwaggerUiOptions = {
    customCss: `
        .topbar-wrapper .link {
            content: url('https://4hmartin.com/4HM_LOGO_V2_WHITE.png');
            height: 80px;
            width: auto;
        }
    `,
    customSiteTitle: 'Docs REST API Node.js / Express / TypeScript',
}

export default swaggerSpec
export { swaggerUiOptions };