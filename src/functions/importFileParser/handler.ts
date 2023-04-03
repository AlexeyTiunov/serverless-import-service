import { S3Event, S3Handler } from "aws-lambda";
import { GetObjectCommandInput, S3 } from "@aws-sdk/client-s3";
import csv from "csv-parser";
import { copyObject } from "../../services/s3/copyObject";
import { SQS } from "@aws-sdk/client-sqs";
import { sendSqsMessage } from "../../services/sqs/sendSqsMessage";

const { pipeline } = require("node:stream/promises");

const client: S3 = new S3({ region: "us-east-1" });
const clientSqs = new SQS({ region: "us-east-1" });
export const importFileParser: S3Handler = async (event: S3Event): Promise<void> => {
  console.log(event.Records);

  const record = event.Records[0];
  const bucket = record.s3.bucket.name;
  const key = record.s3.object.key;
  const params: GetObjectCommandInput = { Bucket: bucket, Key: key };

  const response = await client.getObject(params);
  await copyObject(client, bucket, key, key.replace("uploaded", "parsed"));
  const csvTextStream: NodeJS.ReadableStream = response.Body as NodeJS.ReadableStream;

  const dataStream = csv();
  await pipeline(csvTextStream, dataStream);

  const data = dataStream.read();

  await sendSqsMessage(clientSqs, data);
};
