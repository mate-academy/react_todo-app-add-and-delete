import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[],
  tempTodo: Todo | null,
  deleteTodoById: (todoId: number) => void,
  isLoading: boolean,
  completedTodos: Todo[],
}

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodoById,
  tempTodo,
  isLoading,
  completedTodos,
}) => {
  return (
    <>
      <section className="todoapp__main">
        {todos.map(todo => (
          <TodoItem
            todo={todo}
            key={todo.id}
            deleteTodoById={deleteTodoById}
            isLoading={isLoading}
            completedTodos={completedTodos}
          />
        ))}

        {tempTodo && (
          <div
            className={classNames('todo', {
              completed: tempTodo.completed,
            })}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span className="todo__title">{tempTodo.title}</span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => deleteTodoById(tempTodo.id)}
            >
              ×
            </button>

            <div className={classNames('modal', 'overlay', {
              'is-active': isLoading && tempTodo,
            })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}
      </section>

    </>
  );
};
