import React from 'react';

import { Todo } from '../types/Todo';
import { Status } from '../types/Status';
import { Filter } from './Filter';
import { Errors } from '../types/Errors';
import { wait } from '../utils/fetchClient';

type Props = {
  onFilter: (value: Status) => void;
  onUncompletedTodos: () => Todo[];
  currentFilterStatus: Status;
  todos: Todo[];
  onDeleteTodo: (todoId: number) => Promise<unknown>;
  clearError: (clearStr: string) => void;
  onSetError: (error: string) => void;
};

export const Footer: React.FC<Props> = ({
  onUncompletedTodos,
  onFilter,
  currentFilterStatus,
  todos,
  onDeleteTodo,
  clearError,
  onSetError,
}) => {
  const isAnyTodoCompleted = todos.some(todo => todo.completed === true);

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    try {
      await Promise.all(completedTodos.map(todo => onDeleteTodo(todo.id)));
    } catch {
      onSetError(Errors.Delete);
    } finally {
      wait(3000).then(() => clearError(''));
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${onUncompletedTodos().length} items left`}
      </span>

      <Filter onFilter={onFilter} currentFilterStatus={currentFilterStatus} />
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isAnyTodoCompleted}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
