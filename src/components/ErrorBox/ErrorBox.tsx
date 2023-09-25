import { FC, useContext } from 'react';
import cn from 'classnames';
import { ErrorProvider } from '../../context/TodoError';

type TTodoErrorProps = {
  hasAddTodoErrorTimerId: { current: number }
  hasGetTodoErrorTimerId: { current: number }
  hasDeleteTodoErrorTimerId: { current: number }
  inputFieldRef: { current: HTMLInputElement | null }
};

export const ErrorBox: FC<TTodoErrorProps> = ({
  hasAddTodoErrorTimerId,
  hasGetTodoErrorTimerId,
  hasDeleteTodoErrorTimerId,
  inputFieldRef,
}) => {
  const {
    error,
    setError,
  } = useContext(ErrorProvider);

  const handleCloseClick = () => {
    setError(prev => ({
      ...prev,
      hasError: false,
    }));
    clearTimeout(hasAddTodoErrorTimerId.current);
    clearTimeout(hasGetTodoErrorTimerId.current);
    clearTimeout(hasDeleteTodoErrorTimerId.current);

    if (inputFieldRef.current) {
      inputFieldRef.current.focus();
    }
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !error.hasError,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="delete"
        onClick={handleCloseClick}
      />
      {error.hasError && error.message}
    </div>
  );
};
