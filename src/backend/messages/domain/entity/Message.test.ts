import { describe, expect, test } from "vitest";
import { MessageNotFoundError } from "#context/domain/error/MessageNotFoundError.js";
import { Message } from "./Message.js";

/**
 * The tests of the use cases check the rules of a message, and its errors. They compare an error with an error of the same class: they
 * do not see its name. This test checks the names: the logs show them.
 */
describe("the errors of the domain", () => {
  test("a text that is not valid gives an error named InvalidMessageError", () => {
    expect(() => Message.create("m1", " ")).toThrow(expect.objectContaining({ name: "InvalidMessageError" }));
  });

  test("the error of a message that does not exist is named MessageNotFoundError", () => {
    expect(new MessageNotFoundError("m1").name).toBe("MessageNotFoundError");
  });
});
