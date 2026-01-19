import { runner } from "node-pg-migrate";
import { join } from "path";
import database from "infra/database.js";
import { createRouter } from "next-connect";

import controller from "infra/controller";
const router = createRouter();

router.get(async (req, res) => {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const defaultMigrationsOptions = {
      dbClient,
      dryRun: false,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    const pendingMigrations = await runner({
      ...defaultMigrationsOptions,
      dryRun: true,
    });

    return res.status(200).json(pendingMigrations);
  } finally {
    await dbClient.end();
  }
});
router.post(async (req, res) => {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const defaultMigrationsOptions = {
      dbClient,
      dryRun: false,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    const migratedMigrations = await runner({
      ...defaultMigrationsOptions,
    });

    if (migratedMigrations.length > 0) {
      return res.status(201).json(migratedMigrations);
    }
    return res.status(200).json(migratedMigrations);
  } finally {
    await dbClient.end();
  }
});

export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
