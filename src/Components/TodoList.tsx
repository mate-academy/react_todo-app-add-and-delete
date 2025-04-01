/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { RefObject } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodolistProps {
  loadingTodoIds: number[] | null;
  setLoadingTodoIds: (value: number[] | null) => void;
  loadingAllTodos: boolean;
  setErrorMessage: (value: string) => void;
  setTodos: (value: Todo[]) => void;
  todos: Todo[];
  inputRef: RefObject<HTMLInputElement>;
  updateTodo: (updatedTodo: Todo) => Promise<void>;
  editingTitle: string;
  setEditingTitle: (value: string) => void;
  editingTodoId: number | null;
  setEditingTodoId: (value: number | null) => void;
  filteredTodos: Todo[];
  deleteTodo: (todoId: number) => Promise<void>;
}

export const TodoList: React.FC<TodolistProps> = ({
  loadingTodoIds,
  loadingAllTodos,
  setErrorMessage,
  todos,
  updateTodo,
  editingTitle,
  setEditingTitle,
  editingTodoId,
  setEditingTodoId,
  filteredTodos,
  deleteTodo,
  setLoadingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loadingTodoIds={loadingTodoIds}
          setLoadingTodoIds={setLoadingTodoIds}
          loadingAllTodos={loadingAllTodos}
          setErrorMessage={setErrorMessage}
          todos={todos}
          updateTodo={updateTodo}
          editingTitle={editingTitle}
          setEditingTitle={setEditingTitle}
          editingTodoId={editingTodoId}
          setEditingTodoId={setEditingTodoId}
          deleteTodo={deleteTodo}
        />
      ))}
    </section>
  );
};
