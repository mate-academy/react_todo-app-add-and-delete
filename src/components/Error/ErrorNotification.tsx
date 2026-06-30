import classNames from 'classnames';
import { ErrorMessage } from '../../App';
import React from 'react';

type Props = {
  errorMessage: string;
  setErrorMessage: (a: ErrorMessage) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        onClick={() => setErrorMessage(ErrorMessage.default)}
        type="button"
        className="delete"
      />
      {errorMessage}
    </div>
  );
};
