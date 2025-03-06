import cron from "node-cron";
import { CronExpression } from "./cron-expression.enum";

async function someMethod() {}

export function runCronJobs() {
  console.log("===================== REGISTER CRON JOBS =====================");
  cron.schedule(CronExpression.EVERY_DAY_AT_MIDNIGHT, someMethod, {
    timezone: "Asia/Tashkent",
  });
}
