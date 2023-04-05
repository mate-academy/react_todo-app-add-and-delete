import classNames from 'classnames';
import React from 'react';

type Props = {
  error: boolean,
  errorNotice: string,
  closeErrorNotice: (state: string) => void,
};

export const Notification: React.FC<Props> = React.memo(
  ({
    error,
    errorNotice,
    closeErrorNotice,
  }) => {
    return (
      <div
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          aria-label="btn"
          type="button"
          className="delete"
          onClick={() => closeErrorNotice('')}
        />

        {errorNotice}
      </div>
    );
  },
);
