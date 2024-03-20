import cn from 'classnames';
import React from 'react';

import { deleteTodo } from '../../api/todos';
import { useTodos } from '../../hooks/useTodos';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
};

const TodoItem: React.FC<Props> = ({ todo }) => {
  const [selectedTodoId, setSelectedTodoId] = React.useState<number>(0);

  const {
    todos,
    setTodos,
    isLoading,
    setIsLoading,
    handleError,
    isAllDeleted,
  } = useTodos();

  const handleCheckbox = () => {
    setTodos(
      todos.map(prevTodo => {
        return prevTodo.id === todo.id
          ? { ...prevTodo, completed: !prevTodo.completed }
          : prevTodo;
      }),
    );
  };

  const handleDeleteTodo = () => {
    setIsLoading(true);
    setSelectedTodoId(todo.id);

    deleteTodo(todo.id)
      .then(() => {
        setTodos(todos.filter(prevTodo => prevTodo.id !== todo.id));
      })
      .catch(() => {
        handleError('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const firstCondition = isLoading && todo.id === selectedTodoId;
  const secondCondition = todo.completed && isAllDeleted;
  const isLoaderActive = firstCondition || secondCondition;

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={handleCheckbox}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDeleteTodo}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoaderActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
