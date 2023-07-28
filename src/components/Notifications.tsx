/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect } from 'react';

type Props = {
  error: string,
  reset: () => void,
};

export const Notifications: React.FC<Props> = ({ error, reset }) => {
  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        reset();
      }, 3000);

      return () => clearTimeout(timeoutId);
    }

    return () => {};
  }, [error]);

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      },
    )}
    >
      <button type="button" className="delete" />
      {error}
    </div>
  );
};
