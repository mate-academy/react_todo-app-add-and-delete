/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect } from 'react';
import cn from 'classnames';
import { ErrorMessage, TodosContext } from '../TodosContext';

type Props = {};

export const ErrorNotification: React.FC<Props> = () => {
  const {
    alarm,
    setAlarm,
  } = useContext(TodosContext);

  useEffect(() => {
    setTimeout(() => setAlarm(ErrorMessage.Default), 3000);
  }, [alarm]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-light',
        'is-danger',
        'has-text-weight-normal',
        { hidden: !alarm },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setAlarm(ErrorMessage.Default)}
      />

      {/* show only one message at a time */}
      {alarm}
    </div>
  );
};
