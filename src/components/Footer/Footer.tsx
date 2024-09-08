import React from 'react';
import { Options } from '../../types/Options';
import { Todo } from '../../types/Todo';
import { FooterFilter } from '../FooterFilter';

type Props = {
  todos: Todo[];
  selected: Options;
  setSelected: (selected: Options) => void;
  onClearCompleted: () => void;
  activeTodos: Todo[];
};

export const Footer: React.FC<Props> = ({
  todos,
  selected,
  setSelected,
  onClearCompleted,
  activeTodos,
}) => {
  const completeCount = todos.filter(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      <FooterFilter selected={selected} setSelected={setSelected} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={completeCount.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
