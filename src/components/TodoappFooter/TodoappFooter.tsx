import React from 'react';
import { ClearCompletedButton } from '../ClearCompletedButton';
import { Filter } from '../Filter';
import { TodosCounter } from '../TodosCounter';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/Filter';

interface TodoappFooterProps {
  todos: Todo[];
  setFilterStyle: (style: FilterType) => void;
  handleClearCompletedButton: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoappFooter: React.FC<TodoappFooterProps> = ({
  todos,
  setFilterStyle,
  handleClearCompletedButton,
}) => {
  const todosLength = todos.filter(
    todo => !todo.completed && todo.isLoaded,
  ).length;
  const todoIsCompleted = todos.some(todo => todo.completed && todo.isLoaded);

  if (todos.length === 0) {
    return null;
  }

  return (
    /* Hide the footer if there are no todos */
    <footer className="todoapp__footer" data-cy="Footer">
      <TodosCounter todosCount={todosLength} />

      <Filter setFilterStyle={setFilterStyle} />

      <ClearCompletedButton
        todoCompleted={todoIsCompleted}
        handleClearCompletedButton={handleClearCompletedButton}
      />
    </footer>
  );
};
