import classNames from 'classnames';
import React from 'react';

interface Props {
  error: null | string,
  onRemoveError: () => void,
}

export const Error: React.FC<Props> = ({ error, onRemoveError }) => {
  return (
    <>
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger',
          'is-light',
          'has-text-weight-normal', {
            hidden: !error,
          },
        )}
      >
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={onRemoveError}
        />
        {error}
      </div>
    </>
  );
};
