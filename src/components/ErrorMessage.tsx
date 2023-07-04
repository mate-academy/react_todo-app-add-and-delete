/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, memo, useEffect } from 'react';
import { ErrorType } from '../types/HelperTypes';

type Props = {
  errorType: ErrorType;
  removeError: () => void
};

export const ErrorMessage: FC<Props> = memo(({ errorType, removeError }) => {
  useEffect(() => {
    const timerId = setTimeout(() => {
      removeError();
    }, 3000);

    return () => clearTimeout(timerId);
  }, []);

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        onClick={removeError}
      />
      <h2>{errorType}</h2>
    </div>
  );
});
