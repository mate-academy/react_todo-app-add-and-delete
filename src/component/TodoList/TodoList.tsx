/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todoList: Todo[];
  loading: boolean;
  todoDelete: boolean;
  tempTodo: Todo | null;
  clearTodoComplete: boolean;
  deleteTodos: (todoId: number) => Promise<unknown>;
  completed: (todoId: number) => Promise<Todo> | undefined;
};

export const TodoList: React.FC<Props> = ({
  todoDelete,
  todoList,
  loading,
  tempTodo,
  clearTodoComplete,
  deleteTodos,
  completed,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoList.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          todoDelete={todoDelete}
          clearTodoComplete={clearTodoComplete}
          deleteTodos={() => deleteTodos(todo.id)}
          cheketCompleted={() => completed(todo.id)}
        />
      ))}

      {loading && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo?.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
