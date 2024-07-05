import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "@modules/statements/entities/Statement";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { AppError } from "@shared/errors/AppError";

let getStatementOperationUseCase: GetStatementOperationUseCase;

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;

describe("Create Statements", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();

    getStatementOperationUseCase = new GetStatementOperationUseCase(
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

    const depositData: ICreateStatementDTO = {
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 20,
      description: "A new deposit",
    };

    const deposit = await statementsRepository.create(depositData);

    const statement = await getStatementOperationUseCase.execute({
      statement_id: deposit.id,
      user_id: user.id,
    });

    expect(statement).toHaveProperty("id");
    expect(statement.amount).toEqual(20);
    expect(statement.type).toEqual("deposit");
  });

  it(`Should not be able a create a new statements with a invalid user`, async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        statement_id: "non-exists-statement",
        user_id: "non-exists-user",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it(`Should not be able a create a new statements with a invalid statement`, async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        statement_id: "non-exists-statement",
        user_id: "non-exists-user",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
