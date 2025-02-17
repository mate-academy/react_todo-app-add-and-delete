import { Error } from '../types/Error';

export const updateErrorState = (errors: Error[], errorType: Error['type']) => {
  return errors.map(error =>
    error.type === errorType ? { ...error, value: true } : error,
  );
};
