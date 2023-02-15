import React from 'react';
import cn from 'classnames';

type Props = {
  hasError: boolean,
  setHasError: (value: boolean) => void,
  errorMessage: string,
};

export const Notification: React.FC<Props> = ({
  hasError,
  setHasError,
  errorMessage,
}) => {
  return (
    <div
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !hasError },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={() => setHasError(false)}
      />

      {/* show only one message at a time */}
      {errorMessage}
      {/* <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
    </div>
  );
};
