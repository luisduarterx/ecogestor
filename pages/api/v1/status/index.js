import database from "infra/database";
import { createRouter } from "next-connect";
import controller from "infra/controller";
const router = createRouter();

router.get(async (req, res) => {
  const query_server_version = await database.query("SHOW server_version;");
  const query_max_connections = await database.query("SHOW max_connections;");
  const query_openned_conections = await database.query(
    "SELECT count(*) FROM pg_stat_activity;",
  );

  const max_connections = Number(query_max_connections.rows[0].max_connections);
  const openned_connections = Number(query_openned_conections.rows[0].count);
  const server_version = query_server_version.rows[0].server_version;

  res.json({
    database: {
      server_version: server_version,
      max_connections: max_connections,
      openned_connections: openned_connections,
    },
  });
});

export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
