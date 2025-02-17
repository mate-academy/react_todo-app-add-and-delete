import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { Footer } from '../Footer';
import { Filter } from '../../types/Filter';

interface Props {
  todosFromServer: Todo[];
  displayedTodos: Todo[];
  loadingTodosIds: number[];
  filter: Filter;
  setFilter: (value: Filter) => void;
  activeTodosCount: number;
  areThereCompletedTodos: boolean;
  handleDelete: (id: number) => void;
  handleClearCompleted: (todos: Todo[]) => void;
}

export const TodoList: React.FC<Props> = ({
  todosFromServer,
  displayedTodos,
  loadingTodosIds,
  filter,
  setFilter,
  activeTodosCount,
  areThereCompletedTodos,
  handleDelete,
  handleClearCompleted,
}) => (
  <>
    <section className="todoapp__main" data-cy="TodoList">
      {displayedTodos.map(todo => (
        <TodoItem
          todo={todo}
          isLoading={loadingTodosIds.includes(todo.id)}
          handleDelete={handleDelete}
          key={todo.id}
        />
      ))}
    </section>

    <Footer
      activeTodosCount={activeTodosCount}
      areThereCompletedTodos={areThereCompletedTodos}
      filter={filter}
      setFilter={setFilter}
      todosFromServer={todosFromServer}
      handleClearCompleted={handleClearCompleted}
    />
  </>
);
