/** The store sends it to the message bus: add a message on the server. */
export class AddMessageCommand {
  constructor(readonly text: string) {}
}
