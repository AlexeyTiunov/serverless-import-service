import { SendMessageCommandInput } from "@aws-sdk/client-sqs";

export async function sendSqsMessage(client, message) {
  console.log("sendSqsMessage");

  const params = {
    QueueUrl: "https://sqs.us-east-1.amazonaws.com/773434008479/catalogItemsQueue",
    MessageBody: JSON.stringify(message),
  } as SendMessageCommandInput;

  await client.sendMessage(params);
}
