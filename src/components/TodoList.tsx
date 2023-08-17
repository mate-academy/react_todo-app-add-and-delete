import React from 'react';
import { TodoItem } from './TodoItem';
import { useTodo } from '../hooks/useTodo';
import { Todo } from '../types/Todo';

type Props = {
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({ tempTodo }) => {
  const { visibleTodos } = useTodo();

  return (
    <section className="todoapp__main">
      {visibleTodos().map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}

      {tempTodo && (
        <div
          className="todo"
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span className="todo__title">
            {tempTodo.title}
          </span>

          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
