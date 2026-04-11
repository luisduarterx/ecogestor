import { prisma } from "infra/database";
import { createRouter } from "next-connect";
import controller from "infra/controller";
const router = createRouter();

router.get(async (req, res) => {
  const query_server_version = await prisma.$queryRaw`SHOW server_version;`;

  const query_max_connections = await prisma.$queryRaw`SHOW max_connections;`;

  res.json({
    database: {
      server_version: query_server_version[0].server_version,
      max_connections: query_max_connections[0].max_connections,
    },
  });
});

export default router.handler({
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
});
