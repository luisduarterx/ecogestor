import { runner } from "node-pg-migrate";
import { join } from "path";
import database from "infra/database.js";

export default async function migrations(req, res) {
  const methodsAllowed = ["POST", "GET"];
  if (!methodsAllowed.includes(req.method)) {
    res.status(405).json({ error: `Método ${req.method} não permitido!` });
  }
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
    if (req.method == "POST") {
      const migratedMigrations = await runner({
        ...defaultMigrationsOptions,
      });

      if (migratedMigrations.length > 0) {
        return res.status(201).json(migratedMigrations);
      }
      return res.status(200).json(migratedMigrations);
    }
    if (req.method == "GET") {
      const pendingMigrations = await runner({
        ...defaultMigrationsOptions,
        dryRun: true,
      });

      return res.status(200).json(pendingMigrations);
    }
  } catch (error) {
  } finally {
    await dbClient.end();
  }
}
