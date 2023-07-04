/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

interface Props {
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const Notifications: React.FC<Props> = ({ error, setError }) => {
  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !error },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setError(null)}
      />
      {error}
      {/* show only one message at a time */}
      {/* Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
    </div>
  );
};
