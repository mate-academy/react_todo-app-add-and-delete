import { FC, useEffect } from 'react';
import { ErrorMessage } from '../types/Todo';
import cn from 'classnames';

interface Props {
  errorMessage: ErrorMessage;
  setErrorDefault: () => void;
}

export const TodoError: FC<Props> = ({ errorMessage, setErrorDefault }) => {
  useEffect(() => {
    if (errorMessage !== ErrorMessage.DEFAULT) {
      const timer = setTimeout(() => {
        setErrorDefault();
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }

    return;
  }, [errorMessage]);

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
        onClick={setErrorDefault}
      />
      {errorMessage}
    </div>
  );
};
