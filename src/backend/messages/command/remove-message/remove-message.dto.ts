export class RemoveMessageCommand {
  constructor(readonly id: string) {}
}
/** The id of the message that was removed. */
export class RemoveMessageOutput {
  constructor(readonly id: string) {}
}
