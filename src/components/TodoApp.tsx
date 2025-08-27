import React from 'react';
import { Todo } from '../types/Todo';
import { TodoHeader } from './TodoHeader';
import { TodoList } from './TodoList';
import { TodoFooter } from './TodoFooter';
import { FilterStatus } from '../types/FilterStatus';
import { Result } from '../types/Results';

type Props = {
  isLoading: boolean;
  filteredTodos: Todo[];
  allTodos: Todo[];
  todosLeft: number;
  tempTodo: Todo | null;
  isAllTodosCompleted: boolean;
  isHasCompletedTodos: boolean;
  filterStatus: FilterStatus;
  lastAction: number;
  onFilterChange: (status: FilterStatus) => void;
  onNewTodoFormSubmit: (result: Result) => Promise<boolean>;
  onTodoDelete: (todoId: number) => Promise<boolean>;
  onClearCompletedTodos: () => void;
};

export const TodoApp: React.FC<Props> = ({
  isLoading,
  filteredTodos,
  allTodos,
  todosLeft,
  tempTodo,
  isAllTodosCompleted,
  isHasCompletedTodos,
  filterStatus,
  lastAction,
  onFilterChange,
  onNewTodoFormSubmit,
  onTodoDelete,
  onClearCompletedTodos,
}) => {
  return (
    <div className="todoapp__content">
      <TodoHeader
        isLoading={isLoading}
        isTodosListEmpty={filteredTodos.length === 0}
        isAllTodosCompleted={isAllTodosCompleted}
        lastAction={lastAction}
        onNewTodoFormSubmit={onNewTodoFormSubmit}
      />

      {allTodos.length > 0 && (
        <>
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            onTodoDelete={onTodoDelete}
          />

          <TodoFooter
            todosLeft={todosLeft}
            isHasCompletedTodos={isHasCompletedTodos}
            filterStatus={filterStatus}
            onFilterChange={onFilterChange}
            onClearCompletedTodos={onClearCompletedTodos}
          />
        </>
      )}
    </div>
  );
};
