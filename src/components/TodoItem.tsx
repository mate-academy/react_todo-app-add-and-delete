import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodosContext } from './TododsContext/TodosContext';
import { deleteTodo } from '../api/todos';
import { Loader } from './Loader';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    setErrorMessage, setTodos,
  } = useContext(TodosContext);
  const [isDeliting, setIsDeliting] = useState(false);

  const handleDeleteTodo = (todoId: number) => {
    setIsDeliting(true);

    deleteTodo(todoId)
      .then(() => setTodos(
        curentTodos => curentTodos.filter(curtodo => curtodo.id !== todoId),
      ))
      .catch((error) => {
        setErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => setIsDeliting(false));
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {}}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×
      </button>

      {(todo.id === 0 || isDeliting) && (
        <Loader />
      )}
    </div>
  );
};
