import React from 'react';
import classNames from 'classnames';
import { Error } from '../../types/Error';

type Props = {
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<Error>>;
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
        onClick={() => setErrorMessage(Error.none)}
        data-cy="HideErrorButton"
        type="button"
        className="delete"
      />
      {errorMessage}
    </div>
  );
};
