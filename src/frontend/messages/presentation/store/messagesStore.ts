import type { StoreDefinition } from "@ingenioz-it/caits/state/createStore";
import type { Loadable } from "@ingenioz-it/caits/state/Loadable";
import { AddMessageCommand } from "#context/command/add-message/add-message.dto.js";
import { EditMessageCommand } from "#context/command/edit-message/edit-message.dto.js";
import { RemoveMessageCommand } from "#context/command/remove-message/remove-message.dto.js";
import type { MessagesEvent } from "#context/event/MessagesEvent.js";
import { ListMessagesQuery } from "#context/query/list-messages/list-messages.dto.js";
import type { Message } from "#context/domain/entity/Message.js";

/** What the user can change on the board. */
export type Change = "addition" | "edit" | "removal";

export type MessagesState = {
  messages: Loadable<Message[]>;
  /** The last change that the user asked for. One change at a time: the store sends no other while one is on its way. */
  change: { status: "idle" } | { status: "pending"; change: Change } | { status: "failed"; change: Change; reason: string };
};

const pending = (state: MessagesState, change: Change): MessagesState =>
  state.change.status === "pending" ? state : { ...state, change: { status: "pending", change } };

/** The messages store. When a handler publishes `MessagesChanged`, the store asks for the messages again. */
const messagesStore: StoreDefinition<MessagesState, MessagesEvent> = {
  initialState: { messages: { status: "idle" }, change: { status: "idle" } },
  reduce(state, event) {
    switch (event.type) {
      case "messages.requested": return { ...state, messages: { status: "loading" } };
      case "messages.loaded": return { ...state, messages: { status: "loaded", data: event.messages } };
      case "messages.load-failed": return { ...state, messages: { status: "failed", message: event.reason } };
      case "messages.addition-requested": return pending(state, "addition");
      case "messages.edit-requested": return pending(state, "edit");
      case "messages.removal-requested": return pending(state, "removal");
      case "messages.changed": return { ...state, change: { status: "idle" } };
      // One change at a time: the failure is the one of the change on its way.
      case "messages.change-failed": return state.change.status === "pending" ? { ...state, change: { status: "failed", change: state.change.change, reason: event.reason } } : state;
    }
  },
  send(state, event) {
    if (event.type === "messages.requested" || event.type === "messages.changed") return new ListMessagesQuery();
    if (state.change.status === "pending") return undefined;
    if (event.type === "messages.addition-requested") return new AddMessageCommand(event.text);
    if (event.type === "messages.edit-requested") return new EditMessageCommand(event.id, event.text);
    if (event.type === "messages.removal-requested") return new RemoveMessageCommand(event.id);
    return undefined;
  }
};

export default messagesStore;
