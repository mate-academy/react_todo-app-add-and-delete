import classNames from 'classnames';
import React from 'react';

type Props = {
  isErrorVisible: boolean;
  onClose: (hideError: boolean) => void;
  errorMessage: string;
};

export const ErrorNotification: React.FC<Props> = ({
  isErrorVisible,
  onClose,
  errorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !isErrorVisible,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onClose(false)}
      />
      {/* show only one message at a time */}
      {errorMessage}
      {/*
      Unable to load todos
      {/* <br />
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
