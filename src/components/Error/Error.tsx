import React from 'react';
import { TypeError } from '../../types/TypeError';

export type Props = {
  errorType: TypeError,
  onRemoveErrorHandler(): void,
};

export const Error: React.FC<Props> = ({ errorType, onRemoveErrorHandler }) => {
  const errorHadler = (type: TypeError) => {
    switch (type) {
      case TypeError.ADD:
        return 'Unable to add a todo';

      case TypeError.DELETE:
        return 'Unable to delete a todo';

      case TypeError.TITLE:
        return 'Title can`t be empty';

      case TypeError.REMOVE:
        return 'Unable to delete completed todos';

      case TypeError.UPDATE:
        return 'Unable to update a todo';

      default:
        return 'Error';
    }
  };

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      {/* eslint-disable-next-line */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onRemoveErrorHandler}
      />
      {errorHadler(errorType)}
    </div>
  );
};
