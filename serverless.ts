import type { AWS } from "@serverless/typescript";

import importProductsFile from "@functions/importProductsFile";
import importFileParser from "@functions/importFileParser";

const serverlessConfiguration: AWS = {
  service: "import-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      IMPORT_BUCKET: "import-service-mp-us",
      UPLOAD_FOLDER: "uploaded",
    },
  },
  // import the function via paths
  // @ts-ignore
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      importLambdaFnRole: {
        Type: "AWS::IAM::Role",
        Properties: {
          RoleName: "importLambdaFnRole",
          ManagedPolicyArns: ["arn:aws:iam::aws:policy/AmazonS3FullAccess"],
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: {
                  Service: ["lambda.amazonaws.com"],
                },
                Action: ["sts:AssumeRole"],
              },
            ],
          },
          Policies: [
            {
              PolicyName: "importLambdaFnBasicPolicy",
              PolicyDocument: {
                Version: "2012-10-17",
                Statement: {
                  Effect: "Allow",
                  Action: ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
                  Resource: "*",
                },
              },
            },
          ],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
