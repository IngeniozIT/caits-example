/** The store sends it to the message bus: give a message of the server a new text. */
export class EditMessageCommand {
  constructor(readonly id: string, readonly text: string) {}
}
