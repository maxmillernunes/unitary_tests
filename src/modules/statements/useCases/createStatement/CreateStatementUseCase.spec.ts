import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "@modules/statements/entities/Statement";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";
import { AppError } from "@shared/errors/AppError";

let createStatementUseCase: CreateStatementUseCase;

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;

describe("Create Statements", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();

    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it(`Should be able a create a new statements with type deposit`, async () => {
    const userData = {
      name: "John do",
      email: "johndo@gmail.com",
      password: "123",
    };
    const user = await usersRepository.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });

    const deposit: ICreateStatementDTO = {
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 20,
      description: "A new deposit",
    };

    const statement = await createStatementUseCase.execute(deposit);

    expect(statement).toHaveProperty("id");
    expect(statement.amount).toEqual(20);
    expect(statement.type).toEqual("deposit");
  });

  it(`Should be able a create a new statements with type withdraw`, async () => {
    const userData = {
      name: "John do",
      email: "johndo@gmail.com",
      password: "123",
    };
    const user = await usersRepository.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });

    const deposit: ICreateStatementDTO = {
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 20,
      description: "A new deposit",
    };

    const withdraw: ICreateStatementDTO = {
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 10,
      description: "A new deposit",
    };

    await createStatementUseCase.execute(deposit);

    const statement = await createStatementUseCase.execute(withdraw);

    expect(statement).toHaveProperty("id");
    expect(statement.amount).toEqual(10);
    expect(statement.type).toEqual("withdraw");
  });

  it(`Should not be able a create a new statements withdraw without balance`, async () => {
    const userData = {
      name: "John do",
      email: "johndo@gmail.com",
      password: "123",
    };
    const user = await usersRepository.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });

    const deposit: ICreateStatementDTO = {
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 10,
      description: "A new deposit",
    };

    const withdraw: ICreateStatementDTO = {
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 20,
      description: "A new deposit",
    };

    await createStatementUseCase.execute(deposit);

    expect(async () => {
      await createStatementUseCase.execute(withdraw);
    }).rejects.toBeInstanceOf(AppError);
  });

  it(`Should not be able a create a new statements with a invalid user`, async () => {
    const deposit: ICreateStatementDTO = {
      user_id: "non-exits-user",
      type: OperationType.DEPOSIT,
      amount: 20,
      description: "A new deposit",
    };

    expect(async () => {
      await createStatementUseCase.execute(deposit);
    }).rejects.toBeInstanceOf(AppError);
  });
});
