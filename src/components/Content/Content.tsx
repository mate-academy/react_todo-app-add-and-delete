import React from 'react';
import { Header } from './Header';
import { TodoList } from './TodoList';
import { Footer } from './Footer';
import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/TodoStatus';

type Props = {
  todos: Todo[];
  newTodo: React.RefObject<HTMLInputElement>;
  tempTodo: Todo | null;
  activeTodos: number;
  completedTodos: Todo[];
  todoFilter: TodoStatus;
  isTodos: boolean;
  isAdding: boolean;
  isProcessed: number[];
  onTodoFilter: (filterStatus: TodoStatus) => void;
  onAddTodo: (newTodoTitle: string) => void;
  onUpdateTodo: (todoId: number, data: {}) => void;
  onDeleteTodo: (todoId: number) => void;
};

export const Content: React.FC<Props> = ({
  todos,
  newTodo,
  tempTodo,
  activeTodos,
  completedTodos,
  todoFilter,
  isTodos,
  isAdding,
  isProcessed,
  onTodoFilter,
  onAddTodo,
  onUpdateTodo,
  onDeleteTodo,
}) => (
  <div className="todoapp__content">
    <Header
      newTodo={newTodo}
      todos={todos}
      isAdding={isAdding}
      onAddTodo={onAddTodo}
    />

    <TodoList
      todos={todos}
      tempTodo={tempTodo}
      isProcessed={isProcessed}
      onUpdateTodo={onUpdateTodo}
      onDeleteTodo={onDeleteTodo}
    />

    {isTodos && (
      <Footer
        activeTodos={activeTodos}
        completedTodos={completedTodos}
        todoFilter={todoFilter}
        onTodoFilter={onTodoFilter}
        onDeleteTodo={onDeleteTodo}
      />
    )}
  </div>
);
