/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { memo } from 'react';
import cn from 'classnames';

type Props = {
  messages: string[];
  close: (m: string) => void;
};

export const ErrorNotification: React.FC<Props> = memo((props) => {
  const { messages, close } = props;

  return (
    <>
      {messages.map(message => (
        <div
          data-cy="ErrorNotification"
          className={cn(
            'notification is-danger is-light has-text-weight-normal',
            { hidden: !messages },
          )}
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => close(message)}
          />

          {message}
        </div>
      ))}
    </>
  );
});
