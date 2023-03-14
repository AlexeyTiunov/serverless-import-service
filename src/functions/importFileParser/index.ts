import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.importFileParser`,
  role: "importLambdaFnRole",
  events: [
    {
      s3: {
        bucket: "import-service-mp-us",
        event: "s3:ObjectCreated:*",
        rules: [{ prefix: "uploaded" }, { suffix: ".csv" }],
        existing: true,
      },
    },
  ],
};
