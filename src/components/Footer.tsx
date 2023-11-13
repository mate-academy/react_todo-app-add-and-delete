/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../types/Todo';
import { Filter } from './Filter';
import { TodoStatus } from '../types/TodoStatus';

type Props = {
  todos: Todo[],
  onChangeSelect: (event: TodoStatus) => void,
  selectedOption: string,
  onHandleDeleteAll: () => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  onChangeSelect = () => {},
  selectedOption,
  onHandleDeleteAll,
}) => {
  function countCompletedTodos() {
    let counterCompletedTodos = 0;

    todos.forEach((todo) => {
      if (!todo.completed && todo.id) {
        counterCompletedTodos += 1;
      }
    }, 0);

    return counterCompletedTodos;
  }

  const counterNotCompletedTodos = countCompletedTodos();
  const existsCompleted = !!todos.find((todo) => todo.completed);

  return (
    <footer
      className="todoapp__footer"
      data-cy="Footer"
    >
      <span
        className="todo-count"
        data-cy="TodosCounter"
      >
        {`${counterNotCompletedTodos} items left`}
      </span>

      <Filter
        onChangeSelect={onChangeSelect}
        selectedOption={selectedOption}
      />

      <button
        type="button"
        disabled={!existsCompleted}
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onHandleDeleteAll}
      >
        Clear completed
      </button>
    </footer>
  );
};
