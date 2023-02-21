import classNames from 'classnames';
import React from 'react';

type Props = {
  typeError: string;
  isError: boolean;
  setIsError: (value: boolean) => void;
};

export const Notification:React.FC<Props> = React.memo(
  ({
    typeError,
    isError,
    setIsError,
  }) => {
    return (
      <div className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !isError },
      )}
      >
        <button
          type="button"
          className="delete"
          aria-label="delete-button"
          onClick={() => setIsError(false)}
        />
        {/* show only one message at a time */}
        {`Unable to ${typeError} a todo`}
      </div>
    );
  },
);
