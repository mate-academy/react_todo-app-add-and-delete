import { FC } from 'react';
import { ErrorMessages } from '../../types/ErrorMessages';
import cn from 'classnames';

interface Props {
  errorMessage: ErrorMessages;
  onResetError: () => void;
}

export const ErrorNotification: FC<Props> = ({
  errorMessage,
  onResetError,
}) => {
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
        onClick={onResetError}
      />
      {errorMessage}
    </div>
  );
};
