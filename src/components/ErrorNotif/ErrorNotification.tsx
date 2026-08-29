import classNames from 'classnames';
import React from 'react';

type Props = {
  onHide: () => void;
  errorMessage: string | null;
};

export const ErrorNotification: React.FC<Props> = ({
  onHide,
  errorMessage,
}) => {
  return (
    <>
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: errorMessage === null },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={onHide}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </>
  );
};
