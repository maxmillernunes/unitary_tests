import { Connection, createConnection, getConnectionOptions } from "typeorm";

// createConnection()

export default async (host = "localhost"): Promise<Connection> => {
  const defaultConnection = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultConnection, {
      host,
      database:
        process.env.NODE_ENV === "test"
          ? "rentx_test"
          : defaultConnection.database,
    })
  );
};
