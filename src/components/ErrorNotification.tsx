import cn from 'classnames';
import { FC } from 'react';
import { useTodos } from '../lib/TodosContext';
import { ErrorText } from '../types/ErrorText';

export const ErrorNotification: FC = () => {
  const { errorMessage, setErrorMessage } = useTodos();

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
        onClick={() => setErrorMessage(ErrorText.NoErr)}
      />
      {errorMessage}
    </div>
  );
};
