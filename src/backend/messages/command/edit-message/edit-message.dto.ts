export class EditMessageCommand {
  constructor(readonly id: string, readonly text: string) {}
}
/** The message with its new text, as the domain keeps it. */
export class EditMessageOutput {
  constructor(readonly id: string, readonly text: string) {}
}
