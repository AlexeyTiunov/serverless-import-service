import { PutObjectCommandInput, S3 } from "@aws-sdk/client-s3";
import { ListObjectsV2CommandInput } from "@aws-sdk/client-s3";

export async function findObject(key: string) {
  try {
    const client = new S3({ region: "eu-west-1" });
    const params: ListObjectsV2CommandInput = {
      Bucket: process.env.IMPORT_BUCKET,
      Prefix: process.env.UPLOAD_FOLDER,
    };
    const { Contents } = await client.listObjectsV2(params);
    const index = Contents.findIndex((item) => item.Key === key);
    if (index === -1) {
      const putRequest: PutObjectCommandInput = {
        Body: "",
        Bucket: process.env.IMPORT_BUCKET,
        Key: process.env.UPLOAD_FOLDER + "/" + key,
      };

      const putResult = await client.putObject(putRequest);
      console.log(putResult);
    } else {
    }

    console.log(Contents);
  } catch (e) {
    console.log(e);
  }
}

findObject("text.csv");
