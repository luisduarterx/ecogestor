module.exports.up = function (pgm) {
  pgm.createTable("sessions", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    token: {
      type: "varchar(96)",
      notNull: true,
      unique: true,
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users",
    },
    expira_em: {
      type: "timestamptz",
      notNull: true,
    },
    criado_em: {
      type: "timestamptz",
      default: pgm.func("timezone('utc',now())"),
      notNull: true,
    },
    atualizado_em: {
      type: "timestamptz",
      default: pgm.func("timezone('utc',now())"),
      notNull: true,
    },
  });
};

module.exports.down = false;
