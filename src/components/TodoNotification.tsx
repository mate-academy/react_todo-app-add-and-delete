/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useEffect } from 'react';
import { useTodoContext } from '../hooks/useTodoContext';

const TodoNotification = () => {
  const { errorMessage, onError } = useTodoContext();

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        onError('');
      }, 3000);
    }
  }, [errorMessage]);

  return (
    <div className={
      classNames('notification is-danger is-light has-text-weight-normal',
        {
          hidden: errorMessage.length === 0,
        })
    }
    >
      <button
        type="button"
        className="delete"
        onClick={() => onError('')}
      />

      {errorMessage}
    </div>
  );
};

export default TodoNotification;
