import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.importProductsFile`,
  role: "importLambdaFnRole",
  events: [
    {
      http: {
        method: "get",
        path: "import",
        request: {
          parameters: {
            querystrings: {
              name: true,
            },
          },
        },
      },
    },
  ],
};
