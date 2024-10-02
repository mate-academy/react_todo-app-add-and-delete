import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoFilter } from '../enums/TodoFilters.enum';
import { Header } from './Header';
import { Footer } from './Footer';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isLoading: boolean;
  deletingTodoId: number | null;
  shouldFocus: boolean;
  onEmptyTitleError: () => void;
  onAddTodo: (title: string) => void;
  onDelete: (id: number) => void;
  onClearCompleted: () => void;
};

export const Todos: React.FC<Props> = ({
  todos,
  tempTodo,
  isLoading,
  deletingTodoId,
  shouldFocus,
  onEmptyTitleError,
  onAddTodo,
  onDelete,
  onClearCompleted,
}) => {
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.All);

  const hasAllTodosCompleted = todos.every(todo => todo.completed);
  const hasCompletedTodos = todos.some(todo => todo.completed);
  const notCompletedTodos = todos.filter(todo => !todo.completed);

  const filteredTodos = todos.filter(todo => {
    if (filter === TodoFilter.Active) {
      return !todo.completed;
    }

    if (filter === TodoFilter.Completed) {
      return todo.completed;
    }

    return true;
  });

  return (
    <div className="todoapp__content">
      <Header
        hasAllTodosCompleted={hasAllTodosCompleted}
        onEmptyTitleError={onEmptyTitleError}
        onAddTodo={onAddTodo}
        isLoading={isLoading}
        shouldFocus={shouldFocus}
      />

      <section className="todoapp__main" data-cy="TodoList">
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={onDelete}
            isDeleting={deletingTodoId === todo.id}
          />
        ))}
        {tempTodo && <TodoItem todo={tempTodo} isLoading={isLoading} />}
      </section>

      {todos.length > 0 && (
        <Footer
          filter={filter}
          hasCompletedTodos={hasCompletedTodos}
          notCompletedTodosCount={notCompletedTodos}
          setFilter={setFilter}
          onClearCompleted={onClearCompleted}
        />
      )}
    </div>
  );
};
