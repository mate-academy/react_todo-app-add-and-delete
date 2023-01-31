/* eslint-disable jsx-a11y/control-has-associated-label */
import { memo } from 'react';

interface ErrorNotificationProps {
  messages: string[];
  close: (m: string) => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = memo(
  ({ messages, close }) => (
    <>
      {messages.map(message => (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => close(message)}
          />

          {message}
          <br />
        </div>
      ))}
    </>
  ),
);
