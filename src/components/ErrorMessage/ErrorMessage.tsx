import React, { useContext } from 'react';
import { TodosContext } from '../../TodoProvider';

export const ErrorMessage: React.FC = () => {
  const { errorMessage, setErrorMessage } = useContext(TodosContext);

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        aria-label="Close"
        className="delete"
        onClick={() => setErrorMessage('')}
      />

      {errorMessage}
      <br />
    </div>
  );
};
