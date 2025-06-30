import React from 'react';
import { TodoListProps } from '../../types/TodoListProps';
import { TodoItem } from '../TodoItem/TodoItem';
import { Loader } from '../Loader/Loader';
import { filteredTodos } from '../../utils/filteredTodos';
import { FilterStatus } from '../../types/FilterButtonsProps';

interface ExtendedTodoListProps extends TodoListProps {
  isLoading: boolean;
  query: string;
  filterStatus: FilterStatus;
  deletingTodoId: number | null;
  selectedTodoId: number | null;
}

export const TodoList: React.FC<ExtendedTodoListProps> = ({
  todos = [],
  isLoading,
  selectedTodoId,
  deletingTodoId,
  handleToggleStatus,
  handleDelete,
  query,
  filterStatus,
  tempTodo,
}) => {
  const combinedTodos = tempTodo ? [tempTodo, ...todos] : todos;
  const visibleTodos = filteredTodos(combinedTodos, {
    query,
    status: filterStatus,
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {isLoading && (
        <div data-cy="Loader" className="loader">
          <Loader />
        </div>
      )}

      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id === 0 ? 'temp' : todo.id}
          todo={todo}
          isProcessed={selectedTodoId === todo.id || todo.isTemp === true}
          isDeleting={deletingTodoId === todo.id}
          onToggle={handleToggleStatus}
          onDelete={handleDelete}
          isLoading={todo.isTemp === true}
          dataCy="Todo"
        />
      ))}
    </section>
  );
};
