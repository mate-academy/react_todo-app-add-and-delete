import React from 'react';
import { Todo } from '../types/Todo';
import { FilterNav } from './FilterNav';
import { ClearCompletedButton } from './ClearCompletedButton';
import { Filter } from '../types/Filter';

type FooterProps = {
  todos: Todo[],
  filter: Filter,
  setFilter: React.Dispatch<React.SetStateAction<Filter>>,
  allTodosIncompleted: boolean,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  showErrorNotification: (error: string) => void,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setLoadingActiveTodoId: React.Dispatch<React.SetStateAction<number[]>>,
};

export const Footer: React.FC<FooterProps> = ({
  todos,
  filter,
  setFilter,
  allTodosIncompleted,
  setTodos,
  showErrorNotification,
  setLoading,
  setLoadingActiveTodoId,
}) => {
  const remainingTodosLength = todos.filter((todo) => !todo.completed).length;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {remainingTodosLength}
        {' '}
        items left
      </span>

      <FilterNav
        filter={filter}
        setFilter={setFilter}
      />

      <ClearCompletedButton
        allTodosIncompleted={allTodosIncompleted}
        todos={todos}
        setTodos={setTodos}
        showErrorNotification={showErrorNotification}
        setLoading={setLoading}
        setLoadingActiveTodoId={setLoadingActiveTodoId}
      />
    </footer>
  );
};
