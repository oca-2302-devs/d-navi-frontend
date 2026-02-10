import { defineFunction } from "@aws-amplify/backend";

export const api = defineFunction({
  name: "api",
  entry: "./handler.ts",
  environment: {
    MODEL_ID: "anthropic.claude-3-haiku-20240307-v1:0",
    BEDROCK_REGION: "ap-northeast-1",
    ROOM_TTL_MINUTES: "60",
  },
  timeoutSeconds: 60,
});
