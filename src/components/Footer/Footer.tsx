import React, { Dispatch, SetStateAction } from 'react';
import { FooterFilter } from './FooterFillter';

type Props = {
  todosCounter: number;
  checkCompleted: boolean;
  option: string;
  onSetOption: Dispatch<SetStateAction<string>>;
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

      <FooterFilter option={option} onSetOption={onSetOption} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onDeleteCompleted}
        disabled={!checkCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
