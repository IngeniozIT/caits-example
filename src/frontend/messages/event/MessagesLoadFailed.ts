/** The handler publishes it when the server cannot give the messages: `reason` tells why. */
export class MessagesLoadFailed {
  readonly type = "messages.load-failed" as const;
  constructor(readonly reason: string) {}
}
