/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("snapshot", (table) => {
        table.increments("id").primary();
        table.integer("idPortal").notNullable();
        table.jsonb("filters").notNullable();
        table.string("status");
        table.dateTime("lastStarted");
        table.dateTime("lastTerminated");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("snapshot");
};
