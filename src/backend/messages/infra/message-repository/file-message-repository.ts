import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { DataDirectory } from "caits/di/DataDirectory";
import { Message } from "#context/domain/entity/Message.js";
import type { MessageRepository } from "#context/domain/port/message-repository/MessageRepository.js";

/** A message, as the file keeps it. */
type Row = { id: string; text: string };

/**
 * Keeps the messages in a JSON file of the data folder. A change reads the file, changes the rows, then writes the file: the changes
 * run one after the other, else two changes read the same file, and the second one writes over the first.
 */
export class FileMessageRepository implements MessageRepository {
  private readonly path: string;
  /** The end of the last change: the next change starts after it. */
  private changes: Promise<void> = Promise.resolve();

  constructor(directory: DataDirectory, fileName: string) {
    this.path = join(directory, fileName);
  }

  nextId(): Promise<string> {
    return Promise.resolve(randomUUID());
  }

  async list(): Promise<Message[]> {
    return (await this.read()).map(row => Message.restore(row.id, row.text));
  }

  async find(id: string): Promise<Message | undefined> {
    return (await this.list()).find(message => message.id === id);
  }

  save(message: Message): Promise<void> {
    return this.change(rows => {
      const row = { id: message.id, text: message.text };
      const index = rows.findIndex(candidate => candidate.id === message.id);
      if (index === -1) rows.push(row);
      else rows[index] = row;
      return rows;
    });
  }

  remove(id: string): Promise<void> {
    return this.change(rows => rows.filter(row => row.id !== id));
  }

  /** Reads the rows, changes them, then writes them, after the end of the change before. A change that fails does not stop the next. */
  private change(apply: (rows: Row[]) => Row[]): Promise<void> {
    const changed = this.changes.then(async () => { await this.write(apply(await this.read())); });
    this.changes = changed.catch(() => undefined);
    return changed;
  }

  private async read(): Promise<Row[]> {
    try {
      return JSON.parse(await readFile(this.path, "utf8")) as Row[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
  }

  /**
   * Writes the whole file, then renames it: a reader never sees half a file. Each write has a temporary file of its own: another
   * repository on the same file does not rename it.
   */
  private async write(rows: Row[]): Promise<void> {
    await mkdir(dirname(this.path), { recursive: true });
    const temporary = `${this.path}.${randomUUID()}.tmp`;
    await writeFile(temporary, JSON.stringify(rows, null, 2));
    await rename(temporary, this.path);
  }
}
