import React from 'react';
import { ErrorMessage } from '../types/ErrorMessage';
import classNames from 'classnames';

type Props = {
  errorMessage: ErrorMessage | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorMessage | null>>;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => (
  <div
    data-cy="ErrorNotification"
    className={classNames('notification', 'is-danger', 'is-light', {
      hidden: !errorMessage,
    })}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={() => setErrorMessage(null)}
    />
    {errorMessage}
  </div>
);
