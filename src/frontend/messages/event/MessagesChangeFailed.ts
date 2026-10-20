/** A handler publishes it when the server refuses the change on its way, or cannot be reached: `reason` tells why. */
export class MessagesChangeFailed {
  readonly type = "messages.change-failed" as const;
  constructor(readonly reason: string) {}
}
