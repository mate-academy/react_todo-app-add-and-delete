/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import '../../styles/todo.scss';
import { Filter, Todo as Todos } from '../../types/Todo';
import { TodoItem } from '../TodoItem/Todoitem';
import classNames from 'classnames';

type Props = {
  posts: Todos[];
  tempTodo: Todos | null;
  todo: Todos;
  filter: Filter | undefined;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setPosts: React.Dispatch<React.SetStateAction<Todos[]>>;
  loading: boolean;
  updatingIds: number[];
  setUpdatingIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export const Todo: React.FC<Props> = ({
  posts,
  todo,
  setErrorMessage,
  setPosts,
  filter,
  tempTodo,
  loading,
  updatingIds,
  setUpdatingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TodoItem
        key="temp"
        posts={posts}
        setErrorMessage={setErrorMessage}
        setPosts={setPosts}
        filter={filter}
        loading={loading}
        setUpdatingIds={setUpdatingIds}
        updatingIds={updatingIds}
        todo={todo}
      />
      {tempTodo && (
        <div data-cy="Todo" key={0} className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
              disabled
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>
          <button
            type="button"
            aria-label="Delete todo"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled
          >
            ×
          </button>
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': updatingIds,
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
