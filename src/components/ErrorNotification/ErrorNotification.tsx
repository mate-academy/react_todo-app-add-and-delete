import React from 'react';
import './ErrorNotification.scss';
import classNames from 'classnames';

type Props = {
  errorMessage: string;
  onError: (errorMessage: string) => void;
};

export const ErrorNotification: React.FC<Props> = React.memo(
  function ErrorNotification({ errorMessage, onError }) {
    return (
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => onError('')}
        />
        {errorMessage}
      </div>
    );
  },
);
