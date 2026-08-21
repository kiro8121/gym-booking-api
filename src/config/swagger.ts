import swaggerJSDoc from "swagger-jsdoc";

export const swaggerOptions : swaggerJSDoc.Options = {
 definition: {
    openapi: "3.0.0",
    info: {
      title: "Gym Management API",
      version: "1.0.0",
      description: "API for managing Gym's classes and bookings.",
    },
    components: {
       securitySchemes: {
           bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
    },
  },
},
  },

  apis: ["./src/routes/*.ts"],
};

export const specs=swaggerJSDoc(swaggerOptions);