/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import { AppContext } from '../TodoContext/TodoContext';

export const ErrorMessage: React.FC = () => {
  const { error, setError } = useContext(AppContext);

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(null)}
      />
      {error}
    </div>
  );
};

export default ErrorMessage;
