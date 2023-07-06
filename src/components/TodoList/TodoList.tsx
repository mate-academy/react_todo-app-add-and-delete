import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoListItem } from '../TodoListItem/TodoListItem';

interface Props {
  visibleTodos: Todo[];
  deleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  completedIds: number[];
  isLoading: boolean;
}

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  deleteTodo,
  tempTodo,
  completedIds,
  isLoading,
}) => {
  return (
    <section className="todoapp__main">
      {visibleTodos.map(todo => (
        <TodoListItem
          todo={todo}
          deleteTodo={deleteTodo}
          completedIds={completedIds}
        />
      ))}
      {tempTodo && (
        <div
          className={cn('todo', {
            completed: tempTodo.completed,
          })}
          key={tempTodo.id}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
            />
          </label>

          <span className="todo__title">
            {tempTodo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
          >
            ×
          </button>

          <div
            className={cn('modal', 'overlay', {
              'is-active': isLoading,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
