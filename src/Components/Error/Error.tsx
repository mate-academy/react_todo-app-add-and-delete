import React, { useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  error: string;
  onClear: () => void;
};

export const Error: React.FC<Props> = ({ error, onClear }) => {
  useEffect(() => {
    const timeoutID = setTimeout(onClear, 3000);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [error]);

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: error.length === 0 },
      )}
    >
      <button type="button" className="delete" onClick={onClear} hidden={false}>
        {'delete '}
      </button>

      {error}
    </div>
  );
};
