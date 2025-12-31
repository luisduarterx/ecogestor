import database from "../../../infra/database";
const status = async (req, res) => {
  const query_server_version = await database.query("SHOW server_version;");
  const query_max_connections = await database.query("SHOW max_connections;");
  const query_openned_conections = await database.query(
    "SELECT count(*) FROM pg_stat_activity;",
  );

  const max_connections = Number(query_max_connections.rows[0].max_connections);
  const openned_connections = Number(query_openned_conections.rows[0].count);
  const server_version = Number(query_server_version.rows[0].server_version);
  const result = await database.query("SELECT 1+1;");
  console.log(result);

  res.json({
    database: {
      server_version: server_version,
      max_connections: max_connections,
      openned_connections: openned_connections,
    },
  });
};

export default status;
