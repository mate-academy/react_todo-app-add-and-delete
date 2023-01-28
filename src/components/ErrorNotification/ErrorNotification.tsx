/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FC } from 'react';
import cn from 'classnames';

type Props = {
  message: string,
  hideMessage: () => void,
};

export const ErrorNotification: FC<Props> = React.memo(
  ({ message, hideMessage }) => {
    return (
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !message,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideMessage}
        />
        {message}
      </div>
    );
  },
);
