import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  allTodos: Todo[];
  setAllTodos: (arg: Todo[]) => void;
  loadingTodo: boolean;
  setErrorMessage: (arg: string) => void;
  setLoadingTodo: (arg: boolean) => void;
  loadingTodoId: number;
  setLoadingTodoId: (arg: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  allTodos,
  setAllTodos,
  loadingTodo,
  setErrorMessage,
  setLoadingTodo,
  loadingTodoId,
  setLoadingTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          allTodos={allTodos}
          setAllTodos={setAllTodos}
          loadingTodo={loadingTodo}
          setErrorMessage={setErrorMessage}
          setLoadingTodo={setLoadingTodo}
          loadingTodoId={loadingTodoId}
          setLoadingTodoId={setLoadingTodoId}
        />
      ))}
    </section>
  );
};
