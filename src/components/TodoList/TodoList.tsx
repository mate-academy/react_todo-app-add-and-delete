import React, { memo } from 'react';
import './TodoList.scss';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

export type Props = {
  todos: Todo[]
  deleteTodoFromData: (value: number) => void
  temporaryTodo: Todo | null
  deleteTodoIdFromArray: number[]
};

export const TodoList: React.FC<Props> = memo(({
  todos,
  deleteTodoFromData,
  temporaryTodo,
  deleteTodoIdFromArray,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodoFromData={deleteTodoFromData}
          deleteTodoIdFromArray={deleteTodoIdFromArray}
        />
      ))}
      {temporaryTodo
        && (
          <div
            data-cy="Todo"
            className={classNames('todo',
              { completed: temporaryTodo.completed === true })}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span
              data-cy="TodoTitle"
              className="todo__title"
            >
              {temporaryTodo.title}
              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </span>
          </div>
        )}
    </section>
  );
});
