import { FC, useEffect } from 'react';
import { TodoErrors } from '../../types/Error';
import cn from 'classnames';

type Props = {
  errorMessage: TodoErrors | null;
  onClear: () => void;
};

export const ErrorNotification: FC<Props> = ({ errorMessage, onClear }) => {
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      onClear();
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage, onClear]);

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
        onClick={onClear}
      />
      {errorMessage}
    </div>
  );
};
