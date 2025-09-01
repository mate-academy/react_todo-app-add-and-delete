import React, { useState } from 'react';
import cn from 'classnames';

type Props = {
  isError: string;
};

const ErrorNotifacations: React.FC<Props> = ({ isError }) => {
  const [isCloseNotification, setIsCloseNotification] =
    useState<boolean>(false);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !isError || isCloseNotification,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsCloseNotification(true)}
      />
      {/* TODO: show only one message at a time */}

      {isError}
      {/* TODO: */}
      {/*
      Title should not be empty
      <br />
      Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
    </div>
  );
};

export default ErrorNotifacations;
