import React from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../enums/error';

type Props = {
  errorMessage: ErrorMessage,
  setErrorMessage: (value: ErrorMessage) => void,
};

export const Error: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => (
  <div
    className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !errorMessage },
    )}
  >
    <button
      aria-label="none"
      type="button"
      className="delete"
      onClick={() => setErrorMessage(ErrorMessage.NONE)}
    >
      x
    </button>

    <>
      {errorMessage && (
        <p>
          {errorMessage === ErrorMessage.EMPTY
            ? "Title can't be empty"
            : `Unable to ${errorMessage} a todo`}
        </p>
      )}
    </>
  </div>
);
