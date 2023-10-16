/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect } from 'react';

import cn from 'classnames';
import { useErrorsState } from '../../contexts/ErrorsContext';

export const ErrorNotification: React.FC = () => {
  const [errorMessage, setErrorMessage] = useErrorsState();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  });

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
