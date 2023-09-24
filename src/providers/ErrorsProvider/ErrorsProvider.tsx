import {
  PropsWithChildren, createContext, useState,
} from 'react';
import { Errors } from '../../types/Errors';

export type AddError = (err: keyof Errors) => void;

export type ErrorsContextType = {
  addError: AddError,
  errors: Errors,
  clearErrors: () => void,
};

export const ErrorsContext
= createContext<ErrorsContextType | undefined>(undefined);

export const ErrorsProvider = ({ children }: PropsWithChildren) => {
  const [errors, setErrors] = useState<Errors>({
    errorLoadingTodos: false,
    errorEmptyTitle: false,
    errorUnableToAddTodo: false,
    errorUnableToDeleteTodo: false,
    errorUpdateTodo: false,
  });

  const addError: AddError = (err: keyof Errors) => {
    setErrors(prevErrors => ({
      ...prevErrors,
      [err]: true,
    }));
    setTimeout(() => {
      setErrors({
        errorLoadingTodos: false,
        errorEmptyTitle: false,
        errorUnableToAddTodo: false,
        errorUnableToDeleteTodo: false,
        errorUpdateTodo: false,
      });
    }, 3000);
  };

  const clearErrors = () => {
    setErrors({
      errorLoadingTodos: false,
      errorEmptyTitle: false,
      errorUnableToAddTodo: false,
      errorUnableToDeleteTodo: false,
      errorUpdateTodo: false,
    });
  };

  if (ErrorsContext) {
    return (
      <ErrorsContext.Provider value={{ addError, errors, clearErrors }}>
        {children}
      </ErrorsContext.Provider>
    );
  }

  return null;
};
