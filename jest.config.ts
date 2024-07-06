import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

export default {
  bail: true,
  clearMocks: true,
  maxWorkers: 1,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: ["text-summary", "lcov"],
  collectCoverageFrom: [
    "src/modules/**/useCases/**/*UseCase.ts",
    "src/modules/**/useCases/**/*Controller.ts",
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/src/",
  }),
  preset: "ts-jest",
  testMatch: ["**/*.spec.ts"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
