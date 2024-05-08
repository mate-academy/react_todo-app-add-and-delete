import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { Error } from '../types/Todo';

interface Props {
  todos: Todo[];
  onToggleTodo: (id: number) => void;
  filter: string;
  setLoading: (setLoading: boolean) => void;
  loading: boolean;
  setError: (setError: boolean) => void;
  setErrorType: (setErrorType: Error | null) => void;
  handleDeleteTodo: (id: number) => void;
  loadingTodoId: number | null;
  loadingAddTodoId: number | null;
  addNewTodo: boolean;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onToggleTodo,
  filter,
  setLoading,
  setError,
  setErrorType,
  handleDeleteTodo,
  loadingTodoId,
  loadingAddTodoId,
}) => {
  const filteredTodos =
    filter === 'active'
      ? todos.filter(todo => !todo.completed)
      : filter === 'completed'
        ? todos.filter(todo => todo.completed)
        : todos;

  const noTodosMessage =
    filter !== 'all' && filteredTodos.length === 0 ? (
      <p className="todoapp__empty-list-message"></p>
    ) : null;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          title={todo.title}
          completed={todo.completed}
          onToggle={() => onToggleTodo(todo.id)}
          setLoading={setLoading}
          setError={setError}
          setErrorType={setErrorType}
          onDelete={() => handleDeleteTodo(todo.id)}
          loadingTodoId={loadingTodoId}
          loadingAddTodoId={loadingAddTodoId}
          // addNewTodo={loadingAddTodoId === todo.id}
        />
      ))}
      {noTodosMessage}
    </section>
  );
};
