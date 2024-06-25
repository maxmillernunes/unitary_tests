import { AppError } from "@shared/errors/AppError";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;

describe(`Create User`, () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it(`Should be a create a new user`, async () => {
    const userData = {
      name: "John do",
      email: "johndo@gmail.com",
      password: "123",
    };

    const user = await createUserUseCase.execute({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });

    expect(user).toHaveProperty("id");
  });

  it(`Should not be create a new user with the same email`, async () => {
    const userData = {
      name: "John do",
      email: "johndo@gmail.com",
      password: "123",
    };

    const userData2 = {
      name: "John do",
      email: "johndo@gmail.com",
      password: "123",
    };

    await usersRepository.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });

    expect(async () => {
      await createUserUseCase.execute({
        name: userData2.name,
        email: userData2.email,
        password: userData2.password,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
