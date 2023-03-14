import { mockClient } from "aws-sdk-client-mock";
import { getPutUrl } from "../getPutUrl";
import { S3 } from "@aws-sdk/client-s3";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

process.env.IMPORT_BUCKET = "Bucket";
process.env.UPLOAD_FOLDER = "uploaded";

describe("[Function]getPutUrl", () => {
  let s3Mock: any = null;
  beforeAll(() => {
    s3Mock = mockClient(S3);
  });
  it("getPutUrl", async () => {
    const key = "t.csv";
    s3Mock.on(ListObjectsV2Command).resolves({ Contents: [{ Key: "some key" }] });

    const got = await getPutUrl(key);
    expect(got).not.toBeNull();
  });

  it("getPutUrl", async () => {
    const key = "t.csv";
    s3Mock.on(ListObjectsV2Command).resolves({ Contents: [{ Key: process.env.UPLOAD_FOLDER + "/" + key.toLowerCase() }] });

    const got = await getPutUrl(key);
    expect(got).toBeNull();
  });
});
