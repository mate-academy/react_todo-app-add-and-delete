/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect } from 'react';

type Props = {
  errorMessage: string;
  isVisibleErrorMessage: boolean;
  setIsVisibleErrorMessage: (visibility: boolean) => void
};

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  isVisibleErrorMessage,
  setIsVisibleErrorMessage,
}) => {
  useEffect(() => {
    const fadeErrorMessage = () => {
      setTimeout(() => {
        setIsVisibleErrorMessage(false);
      }, 3000);
    };

    fadeErrorMessage();
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={
        classNames(
          ['notification is-danger is-light has-text-weight-normal'],
          { hidden: !isVisibleErrorMessage },
        )
      }
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsVisibleErrorMessage(false)}
      />
      {/* show only one message at a time */}
      {errorMessage}
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
