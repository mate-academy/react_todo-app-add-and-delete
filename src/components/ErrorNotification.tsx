import React, { Dispatch, useEffect } from 'react';
import cn from 'classnames';
import { Errors } from '../types/ErrorType';

type Props = {
  errorMessage: string;
  setErrorMessage: Dispatch<React.SetStateAction<Errors>>;
};

export const ErrorNotification: React.FC<Props> = props => {
  const { errorMessage, setErrorMessage } = props;

  useEffect(() => {
    if (errorMessage === Errors.Default) {
      return;
    }

    const timer = setTimeout(() => setErrorMessage(Errors.Default), 3000);

    return () => clearTimeout(timer);
  }, [errorMessage, setErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(Errors.Default)}
      />
      {errorMessage}
    </div>
  );
};
