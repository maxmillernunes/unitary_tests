import { AppError } from "@shared/errors/AppError";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { User } from "@modules/users/entities/User";

let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepository: InMemoryUsersRepository;

describe(`Show User Profile`, () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();

    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it(`Should be a show user profile`, async () => {
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

    const showUserProfile = await showUserProfileUseCase.execute(user.id);

    expect(showUserProfile).toHaveProperty("id");
    expect(showUserProfile).toBeInstanceOf(User);
  });

  it(`Should not be show profile does not existing`, async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("non-existing");
    }).rejects.toBeInstanceOf(AppError);
  });
});
