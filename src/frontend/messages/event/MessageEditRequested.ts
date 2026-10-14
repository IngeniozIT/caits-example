/** The View publishes it when the user saves the new text of a message. */
export class MessageEditRequested {
  readonly type = "messages.edit-requested" as const;
  constructor(readonly id: string, readonly text: string) {}
}
