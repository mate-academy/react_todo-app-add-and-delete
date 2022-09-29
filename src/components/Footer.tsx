import React from 'react';
import { remove } from '../api/todos';
import { FilterTypes } from '../types/Filter';
import { Todo } from '../types/Todo';
import { Filter } from './Filter';
/* eslint-disable @typescript-eslint/no-explicit-any */

interface Props {
  todos: Todo[],
  tabs: FilterTypes[],
  selectedTabId: string,
  onTabSelected: (value: FilterTypes) => void,
  setTodos: any,
  setError: any
}

export const Footer: React.FC<Props> = ({
  todos,
  tabs,
  selectedTabId,
  onTabSelected,
  setTodos,
  setError,
}) => {
  const notCompleted = todos.filter(({ completed }) => !completed);
  const completedTodos = todos.filter(({ completed }) => completed);

  const handlerClick = (completedTodo: Todo[]) => {
    const fetchData = async () => {
      try {
        completedTodo.forEach(async (todo) => {
          await remove(todo.id);
        });

        setTodos([...notCompleted]);
      } catch (errorFromServer) {
        setError('Unable to delete a todo');
      }
    };

    fetchData();
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${notCompleted.length} items left`}
      </span>

      <Filter
        tabs={tabs}
        selectedTabId={selectedTabId}
        onTabSelected={onTabSelected}
      />
      {completedTodos.length > 0 && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={() => handlerClick(completedTodos)}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
