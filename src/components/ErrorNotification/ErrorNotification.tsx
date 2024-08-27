import React, { useEffect } from 'react';
import cn from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  message: ErrorMessage;
  setMessage: (newErrorMessage: ErrorMessage) => void;
};

export const ErrorNotification: React.FC<Props> = ({ message, setMessage }) => {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (message) {
      timeoutId = setTimeout(() => setMessage(ErrorMessage.Default), 3000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [message, setMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !message,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setMessage(ErrorMessage.Default)}
      />
      {message}
    </div>
  );
};
