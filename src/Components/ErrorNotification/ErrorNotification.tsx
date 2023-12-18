import cn from 'classnames';
import { useEffect } from 'react';
import { useTodoContext } from '../../Context/Context';

export const ErrorNotification = () => {
  const { errorMessage, setErrorMessage } = useTodoContext();

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  });

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage })}
    >
      <button
        aria-label="Hide Error Button"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      { errorMessage }
      <br />
    </div>
  );
};
