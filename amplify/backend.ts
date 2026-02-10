import { defineBackend } from "@aws-amplify/backend";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Function } from "aws-cdk-lib/aws-lambda";

import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { api } from "./functions/api/resource";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  api,
});

const apiLambda = backend.api.resources.lambda as Function;

// Allow the Lambda to access the DynamoDB table
const singleTable = backend.data.resources.tables["SingleTable"] as Table;
singleTable.grantReadWriteData(apiLambda);

// Set the TABLE_NAME environment variable
apiLambda.addEnvironment("TABLE_NAME", singleTable.tableName);

// Add IAM policy to allow Bedrock invocation
// Restrict access to the specific model used in `amplify/functions/api/resource.ts`
apiLambda.addToRolePolicy(
  new PolicyStatement({
    actions: ["bedrock:InvokeModel"],
    resources: [
      "arn:aws:bedrock:ap-northeast-1::foundation-model/anthropic.claude-3-haiku-20240307-v1:0",
    ],
  })
);
