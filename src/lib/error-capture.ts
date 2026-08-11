let lastCapturedError: unknown | undefined;

export function captureError(error: unknown) {
  lastCapturedError = error;
}

export function consumeLastCapturedError(): unknown | undefined {
  const error = lastCapturedError;
  lastCapturedError = undefined;
  return error;
}
