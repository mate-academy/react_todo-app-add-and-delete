/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useState } from 'react';
import '../styles/todo.scss';
type Props = {
  todo: Todo;
  onRemoveTodo: (id: number) => void;
  isLoading?: boolean;
};

export const TodoComponent: React.FC<Props> = ({
  todo,
  isLoading,
  onRemoveTodo,
}) => {
  const [todoClassName, setTodoClassName] = useState<string>(
    'todo item-enter item-enter-active',
  );
  const [isToLoad, setIsToLoad] = useState(isLoading);

  useEffect(() => {
    //setTodoClassName(() => 'todo item-enter-done ');
    // setTimeout(() => {

    // }, 100);
    return () => {
      setTimeout(() => {
        setTodoClassName(() => 'todo item-enter-done ');
      }, 500);
    };
  }, []);

  useEffect(() => {}, [isLoading]);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames(todoClassName, todo.completed && 'completed')}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={async () => {
          try {
            setIsToLoad(true);
            await onRemoveTodo(todo.id);
          } catch (err) {
          } finally {
            setIsToLoad(false);
          }
        }}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', isToLoad && 'is-active')}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
