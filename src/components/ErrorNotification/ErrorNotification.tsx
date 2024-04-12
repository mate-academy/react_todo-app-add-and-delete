import React from 'react';
import { ErrorStatus } from '../../types/ErrorStatus';
import classNames from 'classnames';

type Props = {
  errorMassage: ErrorStatus;
  setErrorMessage: (error: ErrorStatus) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMassage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorMassage === ErrorStatus.NoError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorStatus.NoError)}
      />
      {errorMassage}
    </div>
  );
};
