import { runner } from "node-pg-migrate";
import { join } from "path";
import database from "infra/database.js";

const defaultMigrationsOptions = {
  dryRun: false,
  dir: join("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

const listPendingMigrations = async () => {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await runner({
      ...defaultMigrationsOptions,
      dryRun: true,
      dbClient,
    });

    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
};
const runPendingMigrations = async () => {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await runner({
      ...defaultMigrationsOptions,
      dbClient,
    });

    return migratedMigrations;
  } finally {
    await dbClient?.end();
  }
};

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};
export default migrator;
