import { useState } from 'react';
import { Errors } from '../types/Errors';

type AddError = (err: keyof Errors) => void;

export const useErrors = () => {
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

  return { addError, clearErrors, errors };
};
