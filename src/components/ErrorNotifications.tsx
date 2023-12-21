/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { Error } from '../types/Error';

const errorMessages = [
  { error: Error.Load, message: 'Unable to load todos' },
  { error: Error.Add, message: 'Unable to add a todo' },
  { error: Error.Update, message: 'Unable to update todos' },
  { error: Error.Delete, message: 'Unable to delete todos' },
  { error: Error.EmptyTitle, message: 'Title should not be empty' },
];

type Props = {
  errorType: Error;
  setErrorType: (errorType: null) => void;
};

export const ErrorNotifications: React.FC<Props> = ({
  errorType,
  setErrorType,
}) => {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setErrorType(null);
      setIsHidden(true);
    }, 3000);
  }, [setErrorType]);

  const handleDelete = () => {
    setErrorType(null);
    setIsHidden(true);
  };

  const certainErrorMaessage
    = errorMessages.filter(message => message.error === errorType)[0].message;

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: isHidden },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleDelete}
      />
      {certainErrorMaessage}
    </div>
  );
};
