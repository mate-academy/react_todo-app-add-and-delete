import {
  PropsWithChildren, createContext, useState,
} from 'react';
import { Errors } from '../../types/Errors';

type AddError = (err: keyof Errors) => void;

type ErrorsContextType = {
  addError: AddError,
  errors: Errors,
  clearErrors: () => void,
};

export const ErrorsContext = createContext<ErrorsContextType>({
  addError: () => {},
  errors: {
    errorLoadingTodos: false,
    errorEmptyTitle: false,
    errorUnableToAddTodo: false,
    errorUnableToDeleteTodo: false,
    errorUpdateTodo: false,
  },
  clearErrors: () => {},
});

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

  return (
    <ErrorsContext.Provider value={{ addError, errors, clearErrors }}>
      {children}
    </ErrorsContext.Provider>
  );
};
