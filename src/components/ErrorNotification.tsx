import React, { FC, useMemo, useEffect } from 'react';
import { ErrorTypes } from '../types/Error';

const errorMessages = {
  todoLoad: 'Unable to load todos',
  titleLength: 'Title should not be empty',
  addTodo: 'Unable to add a todo',
  deleteTodo: 'Unable to delete a todo',
  updateTodo: 'Unable to update a todo',
};

type Props = {
  errorCases: ErrorTypes;
  updateErrorCases: (value: boolean, error?: keyof ErrorTypes | 'all') => void;
};

export const ErrorNotification: FC<Props> = ({
  errorCases,
  updateErrorCases,
}) => {
  const detectFailCase = useMemo(() => {
    const fail = Object.entries(errorCases).filter(fCase => fCase[1]);

    if (fail.length === 0) {
      return null;
    } else {
      return errorMessages[fail[0][0] as keyof typeof errorMessages];
    }
  }, [errorCases]);

  useEffect(() => {
    if (detectFailCase) {
      const timer = setTimeout(() => {
        updateErrorCases(false);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      return () => {};
    }
  }, [detectFailCase, updateErrorCases]);

  const handleHideError = () => {
    updateErrorCases(false);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${!detectFailCase ? 'hidden' : ''}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleHideError}
      />
      {detectFailCase}
    </div>
  );
};
