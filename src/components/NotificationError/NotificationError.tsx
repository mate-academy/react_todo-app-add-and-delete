import React from 'react';
import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  error: ErrorType;
  setError: (error: ErrorType) => void;
};

export const NotificationError: React.FC<Props> = React.memo(
  ({ error, setError }) => (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        type="button"
        className="delete"
        aria-label="delete_button"
        onClick={() => setError(ErrorType.NOERROR)}
      />
      {error}
    </div>
  ),
);
