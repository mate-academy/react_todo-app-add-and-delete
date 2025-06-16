import React from 'react';
import { ClearCompletedButton } from '../ClearCompletedButton';
import { Filter } from '../Filter';
import { TodosCounter } from '../TodosCounter';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/Filter';

interface TodoappFooterProps {
  todos: Todo[];
  setFilterStyle: (style: FilterType) => void;
  filterStyle: FilterType;
  handleClearCompletedButton: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoappFooter: React.FC<TodoappFooterProps> = ({
  todos,
  setFilterStyle,
  filterStyle,
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
    <footer className="todoapp__footer" data-cy="Footer">
      <TodosCounter todosCount={todosLength} />

      {/* <Filter setFilterStyle={setFilterStyle} filterStyle={FilterType.All} /> */}
      <Filter setFilterStyle={setFilterStyle} filterStyle={filterStyle} />

      <ClearCompletedButton
        todoCompleted={todoIsCompleted}
        handleClearCompletedButton={handleClearCompletedButton}
      />
    </footer>
  );
};
