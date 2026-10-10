import { Token } from "caits/Token";
import type { Message } from "#context/domain/entity/Message.js";

/** The messages that the app keeps. */
export interface MessageRepository {
  /** An id that no message has yet. */
  nextId(): Promise<string>;
  /** The messages, in the order they were added. */
  list(): Promise<Message[]>;
  find(id: string): Promise<Message | undefined>;
  /** Adds the message, or replaces the message that has its id. */
  save(message: Message): Promise<void>;
  /** Removes the message that has this id. An id that no message has changes nothing. */
  remove(id: string): Promise<void>;
}

export const MessageRepository = new Token<MessageRepository>();
