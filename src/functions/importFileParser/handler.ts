import { S3Event, S3Handler } from "aws-lambda";
import each from "async/map";
import { GetObjectCommandInput, S3 } from "@aws-sdk/client-s3";
import csv from "csv-parser";
import * as console from "console";

export const importFileParser: S3Handler = async (event: S3Event): Promise<void> => {
  console.log(event.Records);
  const results = [];
  const client: S3 = new S3({ region: "us-east-1" });

  await each(event.Records, async (record) => {
    const bucket = record.s3.bucket.name;
    const key = record.s3.object.key;
    const params: GetObjectCommandInput = { Bucket: bucket, Key: key };
    try {
      const response = await client.getObject(params);
      const csvTextStream: NodeJS.ReadableStream = response.Body as NodeJS.ReadableStream;
      csvTextStream
        .pipe(csv())
        .on("data", (data) => {
          results.push(data);
        })
        .on("end", () => {
          console.log(results);
        });
    } catch (e) {
      console.log(e);
    }
  });
};
