/** The store sends it to the message bus: remove a message from the server. */
export class RemoveMessageCommand {
  constructor(readonly id: string) {}
}
