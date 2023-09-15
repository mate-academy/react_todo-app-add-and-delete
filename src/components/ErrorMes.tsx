/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { ErrorType } from '../types/ErorrType';

type Props = {
  errorMessage: ErrorType,
  setErrorMessage: (errorMessage: ErrorType) => void,
};

export const ErrorMessage:React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      hidden={errorMessage === ErrorType.None}
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorType.None)}
      />
      {errorMessage}
    </div>
  );
};
