import React from 'react';
import cn from 'classnames';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
  handleTodoClick: (id: number) => void;
  deleteTodos: (id: number) => void;
  isSubmitting: boolean;
}

const TodoList: React.FC<TodoListProps> = React.memo(
  ({ todos, handleTodoClick, deleteTodos, isSubmitting }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(({ id, title, completed }, index) => (
          <div
            key={id}
            data-cy="Todo"
            className={cn('todo', { completed: completed })}
          >
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="todo__status-label" htmlFor={`todo-${id}`}>
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                id={`todo-${id}`}
                checked={completed}
                onChange={() => handleTodoClick(id)}
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => deleteTodos(id)}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={cn('modal overlay', {
                'is-active': isSubmitting && index === todos.length - 1,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))}
      </section>
    );
  },
);

TodoList.displayName = 'TodoList';

export default TodoList;
