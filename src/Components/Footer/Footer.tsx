import React from 'react';
import { Filter } from '../Filter/Filter';
import { SelectOption } from '../../App';

type Props = {
  todosCounter: number;
  checkCompleted: boolean;
  option: SelectOption;
  onSetOption: (v: SelectOption) => void;
};

export const Footer: React.FC<Props> = ({
  option,
  todosCounter,
  checkCompleted,
  onSetOption,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCounter} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <Filter option={option} onSetOption={onSetOption} />

      {!checkCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
