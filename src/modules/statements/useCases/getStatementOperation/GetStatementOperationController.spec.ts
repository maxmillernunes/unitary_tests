import request from "supertest";
import { v4 as uuid } from "uuid";
import { hash } from "bcryptjs";

import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe(`get Statement controller`, () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    const id = uuid();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO
        users
          (
            id,
            name,
            email,
            password,
            created_at
          )
      VALUES
        (
          '${id}',
          'admin',
          'admin@gmail.com',
          '${password}',
          'now()'
        )`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it(`Should be able a get statements`, async () => {
    const session = await request(app).post("/api/v1/sessions").send({
      email: "admin@gmail.com",
      password: "admin",
    });

    const { token } = session.body;

    const statement = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 20,
        description: "A new statement do it",
      })
      .set({
        authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .get(`/api/v1/statements/${statement.body.id}`)
      .set({
        authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("amount");
  });

  it(`Should not be able a get statements with a invalid user`, async () => {
    const session = await request(app).post("/api/v1/sessions").send({
      email: "admin@gmail.com",
      password: "admin",
    });

    const { token } = session.body;

    const statement = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 20,
        description: "A new statement do it",
      })
      .set({
        authorization: `Bearer ${token}`,
      });

    const response = await request(app).get(
      `/api/v1/statements/${statement.body.id}`
    );

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("JWT token is missing!");
  });

  it(`Should not be able a get statements with a invalid statement`, async () => {
    const session = await request(app).post("/api/v1/sessions").send({
      email: "admin@gmail.com",
      password: "admin",
    });

    const { token } = session.body;

    const response = await request(app)
      .get(`/api/v1/statements/${uuid()}`)
      .set({
        authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Statement not found");
  });
});
