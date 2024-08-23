/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, useContext, useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { TodoContext } from '../../context/context';
import { updateTodo } from '../../api/todos';

interface Props {
  todo: Todo;
}

export const TodoItem: FC<Props> = ({ todo }) => {
  const context = useContext(TodoContext);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [todoStatus, setTodoStatus] = useState<boolean | null>(null);

  const onSelectInputChange = (id: number, completed: boolean) => {
    setSelectedTodoId(id);
    setTodoStatus(!completed);
  };

  useEffect(() => {
    if (selectedTodoId !== null && todoStatus !== null) {
      const updateTodoStatus = async () => {
        try {
          context?.setTodoLoading(selectedTodoId, true);
          context?.setErrorMessage('');
          await updateTodo(selectedTodoId, todoStatus);
          context?.setTodos(prevTodos =>
            prevTodos.map(item =>
              item.id === selectedTodoId
                ? { ...item, completed: todoStatus }
                : item,
            ),
          );
        } catch (error) {
          context?.setErrorMessage('Something went wrong');
        } finally {
          context?.setTodoLoading(selectedTodoId, false);
        }
      };

      updateTodoStatus();
    }
  }, [selectedTodoId, todoStatus]);

  const { id, completed, title } = todo;

  return (
    <div
      key={id}
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onSelectInputChange(id, completed)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => context?.handleDelete(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': context?.todoLoadingStates[id] || false,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
