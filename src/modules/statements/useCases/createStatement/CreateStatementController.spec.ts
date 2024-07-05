import { Connection, createConnection, getConnection } from "typeorm";

let connection: Connection;

describe(`Create Statement controller`, () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.dropDatabase();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it(`Test integration`, async () => {
    expect(1 + 1).toBe(2);
  });
});
