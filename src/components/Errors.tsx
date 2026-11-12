import React from 'react';
import cn from 'classnames';
import type { ErrorMessage } from '../types/ErrorsMessage';

type Props = {
  error: ErrorMessage | null;
  onClose: () => void;
};

export default function Errors({ error, onClose }: Props) {
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
        className="delete"
        onClick={onClose}
      />
      {error}
    </div>
  );
}
