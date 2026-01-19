import { runner } from "node-pg-migrate";
import { join } from "path";
import database from "infra/database.js";
import { createRouter } from "next-connect";
import migrator from "models/migrator";

import controller from "infra/controller";
const router = createRouter();

router.get(async (req, res) => {
  const pendingMigrations = await migrator.listPendingMigrations();

  return res.status(200).json(pendingMigrations);
});
router.post(async (req, res) => {
  const migratedMigrations = await migrator.runPendingMigrations();

  if (migratedMigrations.length > 0) {
    return res.status(201).json(migratedMigrations);
  }
  return res.status(200).json(migratedMigrations);
});

export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
