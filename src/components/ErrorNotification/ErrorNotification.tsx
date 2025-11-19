import classNames from 'classnames';
import React, { FC } from 'react';

interface Props {
  error: string;
  onClose: () => void;
}

export const ErrorNotification: FC<Props> = React.memo(
  function ErrorNotification({ error, onClose }) {
    return (
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
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
  },
);
