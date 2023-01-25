import { memo, useEffect } from 'react';
import cn from 'classnames';

interface Props {
  errorMessage: string,
  setErrorMessage: (error: string) => void,
}

export const ErrorNotification:React.FC<Props> = memo(({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />

      {errorMessage}
      {/* Unable to add a todo
      <br />
      <br />
      Unable to update a todo */}
    </div>
  );
});
