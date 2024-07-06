import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "@modules/statements/entities/Statement";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { IGetBalanceDTO } from "./IGetBalanceDTO";
import { AppError } from "@shared/errors/AppError";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";

let getBalanceUseCase: GetBalanceUseCase;

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;

describe("Create Statements", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();

    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository
    );
  });

  it(`Should be able a get a new statements with type deposit`, async () => {
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

    await statementsRepository.create(deposit);

    const statement = await getBalanceUseCase.execute({ user_id: user.id });

    expect(statement.balance).toEqual(20);
    expect(statement.statement).toBeTruthy();
    expect(statement.statement[0]).toHaveProperty("id");
  });

  it(`Should not be able a create a new statements with a invalid user`, async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "non-exists-user" });
    }).rejects.toBeInstanceOf(AppError);
  });
});
