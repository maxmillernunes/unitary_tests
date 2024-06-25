import { AppError } from "@shared/errors/AppError";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { hash } from "bcryptjs";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;

describe(`Authentication User`, () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();

    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it(`Should be a authenticate a user`, async () => {
    const userData = {
      name: "John do",
      email: "johndo@gmail.com",
      password: "123",
    };

    await createUserUseCase.execute({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });

    const showUserProfile = await authenticateUserUseCase.execute({
      email: userData.email,
      password: userData.password,
    });

    expect(showUserProfile).toHaveProperty("user");
    expect(showUserProfile).toHaveProperty("token");
  });

  it(`Should not be authenticate a user with email wrong`, async () => {
    const userData = {
      name: "John do",
      email: "johndo@gmail.com",
      password: "123",
    };

    await createUserUseCase.execute({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "non-existing-email",
        password: userData.password,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it(`Should not be authenticate a user with password wrong`, async () => {
    const userData = {
      name: "John do",
      email: "johndo@gmail.com",
      password: "123",
    };

    await createUserUseCase.execute({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: userData.email,
        password: "wrong-password",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
