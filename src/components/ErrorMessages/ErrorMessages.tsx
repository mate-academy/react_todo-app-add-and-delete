import cn from 'classnames';
import { FC } from 'react';
import { ErrorType } from '../../types/ErrorType';

interface Props {
  errorMessage: ErrorType | null;
  setErrorMessage: (error: ErrorType | null) => void;
}

export const ErrorMessages: FC<Props> = ({
  errorMessage,
  setErrorMessage,

}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        aria-label="Hide Notification"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(null)}
      />
      {errorMessage}
    </div>
  );
};
