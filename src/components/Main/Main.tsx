import React from 'react';
import { TodoList } from '../TodoList';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';

type Props = {
  IsLoadLoader: boolean;
  filter: Filter;
  todos: Todo[];
  filterTodos: (value: Todo[] | ((prev: Todo[]) => Todo[])) => void;
  handleDelete: (todoId: number) => Promise<void>;
};

export const Main: React.FC<Props> = ({
  IsLoadLoader,
  filter,
  todos,
  filterTodos,
  handleDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TodoList
        filter={filter}
        todos={todos}
        filterTodos={filterTodos}
        handleDelete={handleDelete}
      />

      {/* 'is-active' class puts this modal on top of the todo */}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': IsLoadLoader })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </section>
  );
};
