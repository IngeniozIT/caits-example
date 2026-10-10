import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, test, useTempDirectories } from "caits/testing/backend/infra";
import { Message } from "#context/domain/entity/Message.js";
import { describeMessageRepositoryContract } from "#context/domain/port/message-repository/MessageRepository.contract.js";
import { FileMessageRepository } from "./file-message-repository.js";

const freshDirectory = useTempDirectories();

describeMessageRepositoryContract("File", async () => new FileMessageRepository(join(await freshDirectory(), "not-made-yet"), "messages.json"));

describe("FileMessageRepository on a damaged file", () => {
  test("reports the damage instead of pretending there is no message", async () => {
    const directory = await freshDirectory();
    await writeFile(join(directory, "damaged.json"), "{not json");
    await expect(new FileMessageRepository(directory, "damaged.json").list()).rejects.toThrow();
  });

  test("a change that fails does not stop the changes after it", async () => {
    const directory = await freshDirectory();
    await writeFile(join(directory, "messages.json"), "{not json");
    const repository = new FileMessageRepository(directory, "messages.json");
    await expect(repository.save(Message.create("1", "first"))).rejects.toThrow();

    await writeFile(join(directory, "messages.json"), "[]");
    await repository.save(Message.create("2", "second"));

    expect((await repository.list()).map(message => message.text)).toEqual(["second"]);
  });
});

describe("FileMessageRepository with another repository on the same file", () => {
  test("each write has a temporary file of its own: the writes of the two repositories do not break each other", async () => {
    const directory = await freshDirectory();
    const [first, second] = [new FileMessageRepository(directory, "messages.json"), new FileMessageRepository(directory, "messages.json")];
    const saves = Array.from({ length: 20 }, (_, index) => (index % 2 === 0 ? first : second).save(Message.create(String(index), "text")));
    await expect(Promise.all(saves)).resolves.toHaveLength(20);
  });
});
