/* eslint-disable jsx-a11y/control-has-associated-label */
import classnames from 'classnames';
import React, {
  FunctionComponent,
  useEffect,
} from 'react';
import { Errors } from '../../types/Errors';

interface ErrorProps {
  errorMessage: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<Errors>>;
}

export const ErrorNotification: FunctionComponent<ErrorProps> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage(Errors.None);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className={classnames(
        'notification is-danger is-light has-text-weight-normal',
        { 'is-hidden': !errorMessage.length },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(Errors.None)}
      />

      {errorMessage}
    </div>
  );
};
