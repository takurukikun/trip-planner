import { createSwaggerSpec } from "next-swagger-doc";
import { LoginDTOSchema } from "@/app/api/auth/login/dto/login";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "src/app/api", // define api folder under app folder
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Next Swagger API Example",
        version: "1.0",
      },
      components: {
        schemas: {
          LoginDTO: LoginDTOSchema,
        },
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [],
    },
  });
  return spec;
};
