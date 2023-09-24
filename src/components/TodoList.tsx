import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TContext, useTodoContext } from './TodoContext';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  const {
    // todos,
    // setTodos,
    // handleError,
    tempTodos,
    // idTemp,
  } = useTodoContext() as TContext;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => {
        return (
          <TodoItem todo={todo} key={todo.id} />
        );
      })}

      {(tempTodos !== null) && (
        <div data-cy="Todo" className={`${tempTodos?.completed ? 'todo completed' : 'todo'}`} key={tempTodos?.id}>
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodos?.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodos?.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={cn('modal overlay',
              { 'is-active': tempTodos.id === 0 })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
