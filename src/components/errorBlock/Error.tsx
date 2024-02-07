import React, { useContext } from 'react';
import { TodoContext } from '../../Context/TodoContext';

type Props = {
  errorType: string
};

export const Error:React.FC<Props> = ({ errorType }) => {
  const { setHasError } = useContext(TodoContext);

  setTimeout(() => {
    setHasError(false);
  }, 3000);

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Save"
        onClick={() => setHasError(false)}
      />
      {errorType}
      <br />
    </div>
  );
};
