import { CopyObjectCommandInput, DeleteObjectCommandInput } from "@aws-sdk/client-s3";

export async function copyObject(client, bucket: string, copySourse: string, destination: string, deleteCopySource: Boolean = true): Promise<void> {
  // const client: S3 = new S3({ region: "us-east-1" });
  // console.log(bucket);
  // console.log(copySourse);
  // console.log(destination);

  try {
    const copyParams: CopyObjectCommandInput = { Bucket: bucket, CopySource: bucket + "/" + copySourse, Key: destination };
    await client.copyObject(copyParams);
    // console.log(result);
    if (deleteCopySource) {
      const deleteParams: DeleteObjectCommandInput = { Bucket: bucket, Key: copySourse };
      await client.deleteObject(deleteParams);
      // console.log(result);
    }
  } catch (e) {
    console.log(e);
    return;
  }
}

//copyObject("import-service-mp-us", "uploaded/test.csv", "parsed/test.csv");
