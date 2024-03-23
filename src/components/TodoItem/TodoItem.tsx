import React from 'react';
import cn from 'classnames';

import { useTodos } from '../../hooks/useTodos';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
};

const TodoItem: React.FC<Props> = ({ todo }) => {
  const [selectedTodoId, setSelectedTodoId] = React.useState<number>(0);

  const { todos, setTodos, isLoading, isAllDeleted, onDeleteTodo } = useTodos();

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
    setSelectedTodoId(todo.id);
    onDeleteTodo(todo.id);
  };

  // eslint-disable-next-line prettier/prettier
  const isLoaderActive = (isLoading && todo.id === selectedTodoId)
  || (todo.completed && isAllDeleted);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label" aria-label="check todo">
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

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoaderActive || todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
