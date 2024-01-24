import React from 'react';
import cn from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  errorMessege: ErrorMessage;
  close: () => void;
};

export const Notification: React.FC<Props> = ({ errorMessege, close }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: errorMessege === ErrorMessage.NONE,
      })}
    >
      {/* eslint-disable-next-line */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={close}
      />
      {/* show only one message at a time */}
      {errorMessege}
    </div>
  );
};
