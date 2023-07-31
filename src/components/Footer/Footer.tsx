/* eslint-disable import/no-cycle */

import React, { useCallback, useContext } from 'react';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../../context/TodosContext';
import { TodosFilter } from '../TodosFilter';

export const Footer: React.FC = () => {
  const { todos } = useContext(TodosContext);

  const countUnfinished = useCallback(
    (listTodo: Todo[]) => {
      return listTodo.map((todo) => todo.completed).filter((todo) => !todo)
        .length;
    },
    [todos],
  );

  const countFinished = useCallback(
    (listTodo: Todo[]) => {
      return listTodo.map((todo) => todo.completed).filter((todo) => todo)
        .length;
    },
    [todos],
  );

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${countUnfinished(todos)} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <TodosFilter />
      {/* don't show this button if there are no completed todos */}
      <div>
        {countFinished(todos) ? (
          <button type="button" className="todoapp__clear-completed">
            Clear completed
          </button>
        ) : (
          ''
        )}
      </div>
    </footer>
  );
};
