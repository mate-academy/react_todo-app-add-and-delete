import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  isAllDeleting: boolean;
}

export const Main: React.FC<Props> = ({ todos, tempTodo, isAllDeleting }) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          {...todo}
          isLoading={todo.completed && isAllDeleting}
        />
      ))}

      {tempTodo && (
        <TodoItem
          {...tempTodo}
          isLoading
        />
      )}

      {/* This todo is being edited */}
      {/* <div className="todo">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
          />
        </label>

        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>

        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div> */}
    </section>
  );
};
