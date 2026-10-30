import { Controller, InvalidInputError, problem } from "@ingenioz-it/caits/messaging/Controller";
import type { Request } from "@ingenioz-it/caits/messaging/Request";
import { InvalidMessageError } from "#context/domain/error/InvalidMessageError.js";
import { AddMessageCommand, type AddMessageOutput } from "./add-message.dto.js";

/** The body that the API reads: `{ "text": "…" }`. */
const isBody = (body: unknown): body is { text: string } => typeof (body as { text?: unknown } | null)?.text === "string";

/** POST /api/messages: turns the request into an AddMessageCommand, and the output or the error into a response. */
export class AddMessageHttpController extends Controller<AddMessageCommand, AddMessageOutput> {
  protected async toDto(request: Request): Promise<AddMessageCommand> {
    const body = await request.content();
    if (!isBody(body)) throw new InvalidInputError("Invalid body", [{ path: ["text"], message: "The text must be a string." }]);
    return new AddMessageCommand(body.text);
  }

  protected toResponse(output: AddMessageOutput): Response {
    return Response.json(output, { status: 201 });
  }

  protected override toErrorResponse(error: unknown, request: Request): Response | Promise<Response> {
    if (error instanceof InvalidMessageError) return problem(422, "invalid-message", "Invalid message", error.message);
    return super.toErrorResponse(error, request);
  }
}
