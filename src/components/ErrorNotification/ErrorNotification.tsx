import cn from 'classnames';
import { ErrorMessages } from '../../types/ErrorMessages';
import { FC } from 'react';

interface Props {
  error: ErrorMessages;
}

export const ErrorNotification: FC<Props> = ({ error }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className={cn('delete', { hidden: !error })}
      />
      {error}
    </div>
  );
};
