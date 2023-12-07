export const isErrorWithMessage = (obj: any): obj is { message: string } => {
  return typeof obj === 'object' && obj !== null && 'message' in obj;
};
