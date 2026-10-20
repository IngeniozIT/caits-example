export class AddMessageCommand {
  constructor(readonly text: string) {}
}
/** The message that was added, as the domain keeps it. */
export class AddMessageOutput {
  constructor(readonly id: string, readonly text: string) {}
}
