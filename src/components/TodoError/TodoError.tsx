import classNames from 'classnames';
import { useContext } from 'react';
import { ErrorContext } from '../ErrorContextProvider/ErrorContextProvider';

export const TodoError = () => {
  const { hasError, errorMessage, setHasError } = useContext(ErrorContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={
        classNames('notification is-danger is-light has-text-weight-normal', {
          hidden: !hasError,
        })
      }
    >
      {/* eslint-disable */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setHasError(false)}
      />
      {/* eslint-enable */}
      {errorMessage}
    </div>
  );
};
