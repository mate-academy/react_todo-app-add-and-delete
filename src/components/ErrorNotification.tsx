import React from 'react';
import cn from 'classnames';

type Props = {
  err: string | null;
  setErr: (err: string | null) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  err,
  setErr,
}) => {
  const removeNotofication = () => {
    setErr(null);
  };

  return (
    <div
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !err },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label  */}
      <button
        type="button"
        className="delete"
        onClick={removeNotofication}
      />

      {err}

      {/* show only one message at a time
      Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
    </div>
  );
};
