import cn from 'classnames';
import React from 'react';

/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  message: string,
  close: () => void,
};

export const Errornotification: React.FC<Props> = ({
  message,
  close,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal',
        { hidden: !message })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={close}
      />

      {message}
    </div>
  );
};
