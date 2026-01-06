const { exec } = require("node:child_process");

process.stdout.write("🔴 Aguardando postgres aceitar conexões...");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }

    process.stdout.write("🟢 Postgres aceitando conexões");
  }
}

checkPostgres();
