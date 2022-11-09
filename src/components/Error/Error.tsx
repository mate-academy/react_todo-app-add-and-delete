import { FC } from 'react';

type Props = {
  error: string;
  resetError: () => void;
};

export const Error: FC<Props> = ({ error, resetError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={resetError}
      />

      {error === 'title'
        ? 'Title can\'t be empty'
        : `Unable to ${error} a todo`}

    </div>
  );
};
