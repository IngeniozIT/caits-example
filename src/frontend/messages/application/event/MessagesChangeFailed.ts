/** A handler publishes it when the server refuses a change, or cannot be reached: `reason` tells why. */
export class MessagesChangeFailed {
  readonly type = "messages.change-failed" as const;
  constructor(readonly change: "addition" | "edit" | "removal", readonly reason: string) {}
}
