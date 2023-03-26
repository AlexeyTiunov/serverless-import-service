import { mockClient } from "aws-sdk-client-mock";
import { S3, GetObjectCommand } from "@aws-sdk/client-s3";
import { S3Event, S3EventRecord } from "aws-lambda";
import { importFileParser } from "../handler";
import { Readable } from "stream";
//import csv from "csv-parser";

describe("[Function]importFileParser", () => {
  let s3Mock: any = null;
  beforeAll(() => {
    s3Mock = mockClient(S3);
  });
  it("importFileParser", (done) => {
    async function* generate() {
      yield "NAME,AGE\n";
      yield "Daffy Duck,24\n";
    }
    const eventRecord: S3EventRecord = { s3: { bucket: { name: "nd" }, object: { key: "up/text.csv" } } } as S3EventRecord;
    const event: S3Event = { Records: [eventRecord] } as S3Event;
    s3Mock.on(GetObjectCommand).resolves({ Body: Readable.from(generate()) });
    // @ts-ignore
    importFileParser(event).then(() => {
      console.log("done");
      done();
    });
  });
});
