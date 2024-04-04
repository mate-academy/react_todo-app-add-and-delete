import React from 'react';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import Filter from './Filter';

interface Props {
  todos: Todo[];
  itemsLeft: number;
  status: Status;
  onStatusChange: (status: Status) => void;
  haveCompletedTodos: boolean;
  handleClearCompleted: () => void;
}

const Footer: React.FC<Props> = ({
  itemsLeft,
  status,
  onStatusChange,
  haveCompletedTodos,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>

      <Filter status={status} onStatusChange={onStatusChange} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!haveCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
