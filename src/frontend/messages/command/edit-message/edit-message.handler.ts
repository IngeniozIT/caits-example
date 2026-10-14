import type { EventPublisher } from "@ingenioz-it/caits/messaging/EventPublisher";
import type { MessagesEvent } from "#context/event/MessagesEvent.js";
import { MessagesChanged } from "#context/event/MessagesChanged.js";
import { MessagesChangeFailed } from "#context/event/MessagesChangeFailed.js";
import type { MessagesGateway } from "#context/domain/port/messages-gateway/MessagesGateway.js";
import type { EditMessageCommand } from "./edit-message.dto.js";

export class EditMessageHandler {
  constructor(private readonly gateway: MessagesGateway, private readonly events: EventPublisher<MessagesEvent>) {}

  async execute(command: EditMessageCommand): Promise<void> {
    try {
      await this.gateway.edit(command.id, command.text);
      this.events.publish(new MessagesChanged());
    } catch (error) {
      this.events.publish(new MessagesChangeFailed("edit", (error as Error).message));
    }
  }
}
