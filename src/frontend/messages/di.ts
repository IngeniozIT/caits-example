import { bind } from "@ingenioz-it/caits/di/Container";
import { MessagesGateway } from "./domain/port/messages-gateway/MessagesGateway.js";
import { HttpMessagesGateway } from "./infra/messages-gateway/http-messages-gateway.js";

/** The dependencies of the context, in production: the gateway asks the API of the backend for the messages. */
export default [
  bind(MessagesGateway).to(HttpMessagesGateway)
];
