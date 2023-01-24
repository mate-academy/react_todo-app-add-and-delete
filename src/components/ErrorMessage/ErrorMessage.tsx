import { FC, memo } from 'react';

interface Props {
  message: string
  onCloseError: () => void;
}

export const ErrorMessage: FC<Props> = memo(
  ({ message, onCloseError }) => {
    return (
      <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          aria-label="delete-notifies"
          onClick={onCloseError}
        />

        {message}
      </div>
    );
  },
);
