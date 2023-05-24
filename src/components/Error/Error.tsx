/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

type Props = {
  isError: boolean,
  isErrorNotification: boolean,
  setIsErrorNotification: React.Dispatch<React.SetStateAction<boolean>>,
  errorMessage: string,
};

export const Error: React.FC<Props> = ({
  isError,
  isErrorNotification,
  setIsErrorNotification,
  errorMessage,
}) => (
  <>
    {isError && (
      <div className={classNames(
        'notification', 'is-danger', 'is-light', 'has-text-weight-normal', {
          hidden: isErrorNotification,
        },
      )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setIsErrorNotification(true)}
        />

        {errorMessage}
      </div>
    )}
  </>
);
