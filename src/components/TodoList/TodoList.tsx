import React from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  todoLoadingIds: number[];
  deleteTodo: (id: number) => void;
  todoComleted: (id: number, data: { completed: boolean }) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  todoLoadingIds,
  deleteTodo,
  todoComleted,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          todoLoadingIds={todoLoadingIds}
          todoComleted={todoComleted}
          deleteTodo={deleteTodo}
          key={todo.id}
        />
      ))}

      {tempTodo && (
        <div
          data-cy="Todo"
          className={cn('todo', { completed: tempTodo.completed })}
        >
          <label
            className="todo__status-label"
            htmlFor={`todo-status-${tempTodo.id}`}
            aria-label="Toggle todo status"
          >
            <input
              id={`todo-status-${tempTodo.id}`}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
              readOnly
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>
          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', { 'is-active': true })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
