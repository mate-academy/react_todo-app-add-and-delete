import { useContext } from 'react';
import { ErrorContext } from '../store';
import cn from 'classnames';

export const ErrorField: React.FC = () => {
  const { errorMessage } = useContext(ErrorContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
      style={{ display: errorMessage ? 'block' : 'none' }}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      <br />
      {errorMessage}
    </div>
  );
};
