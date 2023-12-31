import { Api, StackContext } from "sst/constructs";

export function ExampleStack({ stack }: StackContext) {
  // Create a HTTP API

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  const api = new Api(stack, "Api", {
    defaults: {
      function: {
        environment: {
          MONGODB_URI: process.env.MONGODB_URI,
        },
      },
    },
    routes: {
      "GET /": "packages/functions/src/lambda.handler",
    },
  });

  // Show the endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}