import { FC } from 'react';
import cn from 'classnames';
import { ErrorType } from '../types';

type Props = {
  errorMessage: ErrorType;
  onResetError: () => void;
};

export const Error: FC<Props> = ({ errorMessage, onResetError }) => {
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
