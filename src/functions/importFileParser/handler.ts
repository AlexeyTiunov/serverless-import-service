import { S3Event, S3Handler } from "aws-lambda";
import { GetObjectCommandInput, S3 } from "@aws-sdk/client-s3";
import csv from "csv-parser";
import * as console from "console";
import { copyObject } from "../../services/s3/copyObject";

const client: S3 = new S3({ region: "us-east-1" });
export const importFileParser: S3Handler = async (event: S3Event): Promise<void> => {
  console.log(event.Records);
  const results = [];
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = record.s3.object.key;
    const params: GetObjectCommandInput = { Bucket: bucket, Key: key };
    try {
      const response = await client.getObject(params);
      await copyObject(client, bucket, key, key.replace("uploaded", "parsed"));
      const csvTextStream: NodeJS.ReadableStream = response.Body as NodeJS.ReadableStream;
      csvTextStream
        .pipe(csv())
        .on("data", (data) => {
          console.log(data);
          results.push(data);
        })
        .on("end", () => {
          if (results.length > 0) {
            console.log(results.length);
            console.log(results);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }
};
