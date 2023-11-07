import React, { RefObject } from 'react';
import { Todo } from './types/Todo';
import { FilterBy } from './types/FilterBy';
import { TodoHeader } from './TodoHeader';
import { TodoList } from './TodoList';
import { TodoFooter } from './TodoFooter';

interface TodoAppContentProps {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  todos: Todo[];
  filterBy: FilterBy;
  todoInput: string;
  isSubmitting: boolean;
  handleAddTodo: (event: React.FormEvent) => void;
  setTodoInput: React.Dispatch<React.SetStateAction<string>>;
  deleteTodo: (todoId: number) => void;
  handleFilterClick:
  (filterType: FilterBy) => (event: React.MouseEvent) => void;
  clearCompletedTodos: () => void;
  focusRef: RefObject<HTMLInputElement>;
}

export const TodoAppContent: React.FC<TodoAppContentProps> = ({
  filteredTodos,
  tempTodo,
  todos,
  filterBy,
  todoInput,
  isSubmitting,
  handleAddTodo,
  setTodoInput,
  deleteTodo,
  handleFilterClick,
  clearCompletedTodos,
  focusRef,
}) => {
  return (
    <div className="todoapp__content">
      <TodoHeader
        isSubmitting={isSubmitting}
        todoInput={todoInput}
        setTodoInput={setTodoInput}
        handleAddTodo={handleAddTodo}
        focusRef={focusRef}
      />

      <TodoList
        filteredTodos={filteredTodos}
        tempTodo={tempTodo}
        deleteTodo={deleteTodo}
      />

      {todos.length > 0 && (
        <TodoFooter
          todos={todos}
          filterBy={filterBy}
          handleFilterClick={handleFilterClick}
          clearCompletedTodos={clearCompletedTodos}
        />
      )}
    </div>
  );
};
