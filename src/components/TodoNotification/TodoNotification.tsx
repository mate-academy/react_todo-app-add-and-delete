/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

import { useTodo } from '../TodoContext/TodoContext';

export const TodoNotification: React.FC = () => {
  const {
    isError,
    setIsError,
    errorMessage,
    setErrorMessage,
  } = useTodo();

  const handleButtonClick = () => {
    setIsError(false);
    setErrorMessage('');
  };

  return (

    <div className={classNames(
      'notification is - danger is - light has - text - weight - normal',
      { hidden: !isError },
    )}
    >
      <button
        type="button"
        className="delete"
        title="Click here"
        onClick={handleButtonClick}
      />

      {errorMessage}
    </div>
  );
};
