import React from 'react';
import { FilterStatus, Todo } from '../types/Todo';
import { Filter } from './Filter';

type Props = {
  selectedTodo: Todo[];
  todoStatus: FilterStatus;
  handleFilterChange: (newTodoStatus: FilterStatus) => void;
  handleDeleteTodo: (todoId: number) => void;
};

export const Footer: React.FC<Props> = ({
  selectedTodo,
  todoStatus,
  handleFilterChange,
  handleDeleteTodo,
}: Props) => {
  const completedTodos = selectedTodo
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {selectedTodo.filter(todo => !todo.completed).length} items left
      </span>

      <Filter todoStatus={todoStatus} handleFilterChange={handleFilterChange} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => completedTodos.forEach(handleDeleteTodo)}
        disabled={!selectedTodo.some((todo: Todo) => todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
