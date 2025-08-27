import { ErrorMessage } from './ErrorMessage';

export type SuccessResult = {
  isSuccess: true;
  value: string;
};

export type ErrorResult = {
  isSuccess: false;
  error: ErrorMessage;
};

export type Result = SuccessResult | ErrorResult;
