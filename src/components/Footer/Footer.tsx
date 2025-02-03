import React from 'react';
import { FilterTodo } from '../FilterTodo/FilterTodo';
import { FilterOption } from '../../types/FilterOption';

interface FooterProps {
  itemsLeft: number;
  option: FilterOption;
  setOption: (option: FilterOption) => void;
  handleClearCompleted: () => void;
  isClearButtonDisabled: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  itemsLeft,
  option,
  setOption,
  handleClearCompleted,
  isClearButtonDisabled,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} items left`}
      </span>

      <FilterTodo selectedOption={option} onSelect={setOption} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={isClearButtonDisabled}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
