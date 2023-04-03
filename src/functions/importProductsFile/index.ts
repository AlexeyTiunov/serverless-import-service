import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.importProductsFile`,
  role: "importLambdaFnRole",
  events: [
    {
      http: {
        method: "get",
        path: "import",
        cors: true,
        authorizer: {
          name: "tokenAuthorizer",
          arn: "arn:aws:lambda:us-east-1:773434008479:function:auth-service-dev-basicAuthorizer",
          resultTtlInSeconds: 0,
          identitySource: "method.request.header.Authorization",
          type: "token",
        },
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
