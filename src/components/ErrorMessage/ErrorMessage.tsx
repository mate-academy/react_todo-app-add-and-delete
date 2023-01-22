import { FC, memo } from 'react';

interface Props {
  message: string
}

export const ErrorMessage: FC<Props> = memo(
  ({ message }) => {
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
        />

        {message}

        {/* Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    );
  },
);
