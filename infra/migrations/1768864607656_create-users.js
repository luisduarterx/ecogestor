module.exports.up = function (pgm) {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    nome: {
      type: "varchar(255)",
      notNull: true,
    },
    email: {
      type: "varchar(255)",
      notNull: true,
      unique: true,
    },
    senha: {
      type: "varchar(72)",
      notNull: true,
    },
    criado_em: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
    atualizado_em: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
  });
};

module.exports.down = false;
