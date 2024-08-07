import request from "supertest";
import { v4 as uuid } from "uuid";
import { hash } from "bcryptjs";

import { Connection, createConnection, getConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe(`Create Statement controller`, () => {
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

  it(`Should be able a create new statement with type deposit`, async () => {
    const session = await request(app).post("/api/v1/sessions").send({
      email: "admin@gmail.com",
      password: "admin",
    });

    const { token } = session.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 20,
        description: "A new statement do it",
      })
      .set({
        authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it(`Should be able a create new statement with type withdraw`, async () => {
    const session = await request(app).post("/api/v1/sessions").send({
      email: "admin@gmail.com",
      password: "admin",
    });

    const { token } = session.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 10,
        description: "A new statement do it",
      })
      .set({
        authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it(`Should not be able a create new statement with insufficient founds`, async () => {
    const session = await request(app).post("/api/v1/sessions").send({
      email: "admin@gmail.com",
      password: "admin",
    });

    const { token } = session.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 20,
        description: "A new statement do it",
      })
      .set({
        authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Insufficient funds");
  });

  it(`Should not be able a create new statement without authentication`, async () => {
    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 20,
        description: "A new statement do it",
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("JWT token is missing!");
  });
});
