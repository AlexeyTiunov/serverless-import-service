import { formatJSONResponse } from "@libs/api-gateway";

import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda";
import { getPutUrl } from "../../services/s3/getPutUrl";

export const HEADERS = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
};
export const importProductsFile: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
  try {
    const fileName = event.queryStringParameters.name;
    const url = await getPutUrl(fileName);
    return formatJSONResponse(url, 200, HEADERS);
  } catch (e) {
    return formatJSONResponse("Error", 500, HEADERS);
  }
};
