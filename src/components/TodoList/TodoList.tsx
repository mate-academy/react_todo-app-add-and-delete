import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { TodoEditForm } from '../TodoEditForm';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
        />
      ))}

      {/* This todo is being edited */}
      <div className="todo">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
          />
        </label>

        <TodoEditForm />

        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          isLoading
        />
      )}
    </section>
  );
};
