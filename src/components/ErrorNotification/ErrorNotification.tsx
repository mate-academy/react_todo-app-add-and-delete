/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import classNames from 'classnames';

import './ErrorNotification.scss';

type Props = {
  errorMessage: string,
};

export const ErrorNotification: React.FC<Props> = ({ errorMessage }) => {
  const [isErrorShown, setIsErrorShown] = useState(!errorMessage);

  setTimeout(() => setIsErrorShown(false), 3000);

  const handleErrorClosing = () => {
    setIsErrorShown(false);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={
        classNames('notification is-danger is-light has-text-weight-normal', {
          hidden: !isErrorShown,
        })
      }
    >
      {errorMessage}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleErrorClosing}
      />

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {/* show only one message at a time */}
      {/* Unable to load todos
        <br />
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
