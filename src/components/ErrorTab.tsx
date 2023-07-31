import React, { useEffect } from 'react';
import classNames from 'classnames';
import { TodoError } from '../types/TodoError';

type Props = {
  errorMesage: TodoError,
  setErrorMesage: (error: TodoError) => void,
};

export const ErrorTab: React.FC<Props> = ({ errorMesage, setErrorMesage }) => {
  useEffect(() => {
    setTimeout(() => setErrorMesage(TodoError.empty), 3000);
  }, []);

  return (
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !errorMesage },
    )}
    >
      {errorMesage}

      <button
        type="button"
        className="delete"
        aria-label="delete"
        onClick={() => setErrorMesage(TodoError.empty)}
      />
    </div>
  );
};
