/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

interface Props {
  error: boolean;
  onHandleError: (arg: boolean) => void;
}

export const ErrorNotification: React.FC<Props> = ({
  error,
  onHandleError,
}) => {
  const closeNotification = () => {
    onHandleError(false);
  };

  return (
    <div
      className={
        classNames(
          'notification is-danger is-light has-text-weight-normal', {
            hidden: !error,
          },
        )
      }
    >
      <button
        type="button"
        className="delete"
        onClick={closeNotification}
      />

      {/* show only one message at a time */}
      Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo
    </div>
  );
};
