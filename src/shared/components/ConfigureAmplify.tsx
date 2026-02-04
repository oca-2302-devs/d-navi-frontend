"use client";

import { Amplify, type ResourcesConfig } from "aws-amplify";

import config from "../../aws-exports";

Amplify.configure(config as ResourcesConfig);

export default function ConfigureAmplify() {
  return null;
}
