import React from 'react';

type Props = {
  message: string,
  setMessage: () => void,
};

/* eslint-disable jsx-a11y/control-has-associated-label */
export const ErrorMessage: React.FC<Props> = ({ message, setMessage }) => {
  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        onClick={setMessage}
      />
      {message}
      {/* Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
    </div>
  );
};
