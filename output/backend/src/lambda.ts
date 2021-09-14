import serverlessExpress from "@vendia/serverless-express";
import { getApp } from "./index";

export const handler = serverlessExpress({ app: getApp() });
