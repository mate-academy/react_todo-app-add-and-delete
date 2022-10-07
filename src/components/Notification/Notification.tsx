/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

type Props = {
  text: string,
  type: 'error' | 'success' | undefined,
  isHidden: boolean,
  setNotification: (state: boolean) => void,
};

export const Notification: React.FC<Props> = (
  {
    text, type, setNotification, isHidden,
  },
) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'has-text-weight-normal',
        {
          'is-danger': type === 'error',
          'is-light': type === 'success',
          hidden: isHidden,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setNotification(true)}
      />
      {text}
    </div>
  );
};
