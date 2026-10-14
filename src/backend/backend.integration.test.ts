import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, productionBackend, test, vi } from "@ingenioz-it/caits/testing/backend/integration";
import { AddMessageCommand } from "./messages/command/add-message/add-message.dto.js";
import { EditMessageCommand } from "./messages/command/edit-message/edit-message.dto.js";
import { RemoveMessageCommand } from "./messages/command/remove-message/remove-message.dto.js";
import { ListMessagesQuery } from "./messages/query/list-messages/list-messages.dto.js";

/**
 * The backend as it runs in production: with the bindings of each di.ts, and no test.di.ts. The backend has one context, thus no
 * context map yet: when a second context reacts to an event of the first, the context map of the first, its context-map.ts, shares it
 * as an event of the context shared (src/backend/shared/), and the context map of the second turns it into its inputs.
 */
describe("the backend, on the production bindings", () => {
  let directory: string | undefined;
  afterEach(async () => {
    vi.unstubAllEnvs();
    if (directory) await rm(directory, { recursive: true, force: true });
  });

  const keptIn = async (folder: string) => JSON.parse(await readFile(join(folder, "messages.json"), "utf8")) as unknown;

  test("keeps the messages in the file messages.json of the folder DATA_DIR, and a new backend finds them there", async () => {
    directory = await mkdtemp(join(tmpdir(), "messages-"));
    vi.stubEnv("DATA_DIR", join(directory, "data"));
    const first = productionBackend();
    const { id } = await first.send(new AddMessageCommand("Hello"));
    await first.send(new AddMessageCommand("Bye"));
    await first.send(new EditMessageCommand(id, "Hello again"));

    expect(await keptIn(join(directory, "data"))).toEqual([{ id, text: "Hello again" }, { id: expect.any(String) as string, text: "Bye" }]);

    const second = productionBackend();
    await second.send(new RemoveMessageCommand(id));
    expect((await second.send(new ListMessagesQuery())).messages.map(message => message.text)).toEqual(["Bye"]);
  });

  test.for([undefined, ""])("without DATA_DIR (%j), the data folder is tmp, in the working folder", async dataDirectory => {
    directory = await mkdtemp(join(tmpdir(), "messages-"));
    vi.stubEnv("DATA_DIR", dataDirectory);
    const workingDirectory = process.cwd();
    process.chdir(directory);
    try {
      await productionBackend().send(new AddMessageCommand("Hello"));
    } finally {
      process.chdir(workingDirectory);
    }

    expect(await keptIn(join(directory, "tmp"))).toEqual([{ id: expect.any(String) as string, text: "Hello" }]);
  });
});
