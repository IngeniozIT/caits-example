export class ListMessagesQuery {}
/** The messages, in the order they were added. */
export class ListMessagesOutput {
  constructor(readonly messages: { id: string; text: string }[]) {}
}
