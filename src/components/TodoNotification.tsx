/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useTodoContext } from '../hooks/useTodoContext';

const TodoNotification = () => {
  const { errorMessage, onError } = useTodoContext();

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
