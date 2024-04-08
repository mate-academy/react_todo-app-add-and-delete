import React from 'react';
import { useTodos } from '../Store/Store';

const ErrorNotification: React.FC = () => {
  const { errorMessage } = useTodos();

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {errorMessage}
    </div>
  );
};

export default ErrorNotification;
