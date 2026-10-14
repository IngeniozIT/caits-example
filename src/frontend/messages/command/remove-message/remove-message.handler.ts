import type { EventPublisher } from "@ingenioz-it/caits/messaging/EventPublisher";
import type { MessagesEvent } from "#context/event/MessagesEvent.js";
import { MessagesChanged } from "#context/event/MessagesChanged.js";
import { MessagesChangeFailed } from "#context/event/MessagesChangeFailed.js";
import type { MessagesGateway } from "#context/domain/port/messages-gateway/MessagesGateway.js";
import type { RemoveMessageCommand } from "./remove-message.dto.js";

export class RemoveMessageHandler {
  constructor(private readonly gateway: MessagesGateway, private readonly events: EventPublisher<MessagesEvent>) {}

  async execute(command: RemoveMessageCommand): Promise<void> {
    try {
      await this.gateway.remove(command.id);
      this.events.publish(new MessagesChanged());
    } catch (error) {
      this.events.publish(new MessagesChangeFailed("removal", (error as Error).message));
    }
  }
}
