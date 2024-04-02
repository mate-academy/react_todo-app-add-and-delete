import React from 'react';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import { Filter } from './Filter';

interface Props {
  todos: Todo[];
  onClearCompleted: (id: number) => void;
  itemsLeft: number;
  status: Status;
  onStatusChange: (status: Status) => void;
  haveCompletedTodos: boolean;
}

export const Footer: React.FC<Props> = ({
  todos,
  onClearCompleted,
  itemsLeft,
  status,
  onStatusChange,
  haveCompletedTodos,
}) => {
  const handleClearCompleted = () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedTodoIds.forEach(id => {
      onClearCompleted(id);
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>

      <Filter status={status} onStatusChange={onStatusChange} />

      <button
        disabled={!haveCompletedTodos}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
