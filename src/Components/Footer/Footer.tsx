import React from 'react';
import { Filter } from '../Filter/Filter';
import { SelectOption } from '../../App';
import cn from 'classnames';

type Props = {
  todosCounter: number;
  checkCompleted: boolean;
  option: SelectOption;
  onSetOption: (v: SelectOption) => void;
  onDeleteCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  option,
  todosCounter,
  checkCompleted,
  onSetOption,
  onDeleteCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCounter} items left
      </span>

      <Filter option={option} onSetOption={onSetOption} />

      <button
        type="button"
        className={cn('todoapp__clear-completed')}
        data-cy="ClearCompletedButton"
        onClick={onDeleteCompleted}
        disabled={!checkCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
