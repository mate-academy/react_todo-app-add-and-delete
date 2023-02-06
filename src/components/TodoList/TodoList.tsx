import React from 'react';
import { FilterStatus } from '../../types/FilterStatus';
import { TempTodo, Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  filterStatus: FilterStatus;
  tempTodo: TempTodo | null,
  onSetTodos: (todos: Todo[]) => void,
  onSetError: (message: string) => void,
  addedTodoIsLoading: boolean,
};

export const TodoList: React.FC<Props> = ({
  todos,
  filterStatus,
  onSetTodos,
  onSetError,
  tempTodo,
  addedTodoIsLoading,

}) => {
  const visibleTodos = todos.filter(todo => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return !todo.completed;
      case FilterStatus.Completed:
        return todo.completed;
      default:
        return todo;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          todos={todos}
          onSetTodos={onSetTodos}
          onSetError={onSetError}
        />
      ))}
      {tempTodo && (
        <TodoInfo
          key={tempTodo.id}
          todo={tempTodo}
          addedTodoIsLoading={addedTodoIsLoading}
        />
      )}
    </section>
  );
};
