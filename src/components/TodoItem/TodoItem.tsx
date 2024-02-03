import classNames from 'classnames';
import React, { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader';
import { TodoUpdateContext, TodosContext } from '../../context/TodosContext';
import { updateTodo } from '../../api/todos';

interface Props {
  todoItem: Todo,
}

export const TodoItem: React.FC<Props> = ({ todoItem }) => {
  const { id, title, completed } = todoItem;
  const { setIsLoading, setErrorMessage, setTodos } = useContext(TodosContext);
  const { deleteTodo } = useContext(TodoUpdateContext);

  async function handleDelete() {
    setIsLoading(true);

    try {
      await deleteTodo(id);
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setIsLoading(false);
    }
  }

  const handleCheckbox = () => {
    setTodos(currentTodos => currentTodos
      .map(currentTodo => (currentTodo.id === id
        ? ({ ...currentTodo, completed: !completed })
        : currentTodo)));

    updateTodo(id, !completed);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className={classNames('todo__status', {
            completed,
          })}
          checked={completed}
          onChange={handleCheckbox}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
      >
        ×
      </button>

      <TodoLoader id={id} />
    </div>
  );
};
