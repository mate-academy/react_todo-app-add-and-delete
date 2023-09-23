import React from 'react';
import { Todo } from '../types/Todo';
import { Filter } from './Filter';
import { TodoStatus } from '../types/TodoStatus';

type Props = {
  todos: Todo[],
  onChangeSelect: (event: TodoStatus) => void,
  selectedOption: string,
};

export const Footer: React.FC<Props> = ({
  todos,
  onChangeSelect = () => {},
  selectedOption,
}) => {
  function countCompletedTodos() {
    let counterCompletedTodos = 0;

    todos.forEach((todo) => {
      if (!todo.completed) {
        counterCompletedTodos += 1;
      }
    }, 0);

    return counterCompletedTodos !== 0 ? counterCompletedTodos : todos.length;
  }

  return (
    <footer
      className="todoapp__footer"
      data-cy="Footer"
    >
      <span
        className="todo-count"
        data-cy="TodosCounter"
      >
        {`${countCompletedTodos()} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <Filter
        onChangeSelect={onChangeSelect}
        selectedOption={selectedOption}
      />

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
