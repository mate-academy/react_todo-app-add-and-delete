/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../../types/Todo';
import { FilterStatus } from '../../helper';
import { ContentHeader } from '../ContentHeader/ContentHeader';
import { ContentMain } from '../ContentMain/ContentMain';
import { ContentFooter } from '../ContentFooter/ContentFooter';

interface Props {
  todos: Todo[],
  filter: string,
  activeTodosQuantity: number,
  onFilterChange: (arg: FilterStatus) => void,
  query: string,
  onQueryChange: (arg: string) => void,
  addTodo: (arg: string) => void,
  isLoading: boolean,
  tempTodo: Todo | null,
  initialTodos: Todo[],
  onErrorMessageChange: (arg: string) => void,
  setIsLoading: (arg: boolean) => void,
  removeTodo: (arg: number) => void,
  removingTodoId: number
}
export const TodoContent: React.FC<Props> = ({
  todos,
  filter,
  activeTodosQuantity,
  onFilterChange,
  query,
  onQueryChange,
  addTodo,
  isLoading,
  tempTodo,
  initialTodos,
  onErrorMessageChange,
  setIsLoading,
  removeTodo,
  removingTodoId,
}) => {
  const handleFilterChange = (status: FilterStatus) => {
    onFilterChange(status);
  };

  const filterStatuses: string[] = Object.values(FilterStatus);

  return (
    <div className="todoapp__content">
      <ContentHeader
        onAddTodo={addTodo}
        query={query}
        onQueryChange={onQueryChange}
        isLoading={isLoading}
        onErrorMessageChange={onErrorMessageChange}
        setIsLoading={setIsLoading}
      />

      {initialTodos.length > 0 && (
        <>
          <ContentMain
            todos={todos}
            tempTodo={tempTodo}
            removeTodo={removeTodo}
            removingTodoId={removingTodoId}
          />
          <ContentFooter
            activeTodosQuantity={activeTodosQuantity}
            filterStatuses={filterStatuses}
            filter={filter}
            handleFilterChange={handleFilterChange}
            initialTodos={initialTodos}
            removeTodo={removeTodo}
          />
        </>
      )}
    </div>
  );
};
