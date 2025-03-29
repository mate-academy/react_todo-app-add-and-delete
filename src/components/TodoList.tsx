import React, { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { ErrorType } from '../types/Error';

type Props = {
  todos: Todo[];
  setUpdateTodoStatus: (id: number, status: boolean) => void;
  tempTodo: Todo | null;
  setError: (value: ErrorType, time?: number) => void;
  setDeleteItemFromTodos: (id: number) => void;
  loading: number[];
  setLoading: Dispatch<SetStateAction<number[]>>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setUpdateTodoStatus,
  tempTodo,
  setError,
  setDeleteItemFromTodos,
  loading,
  setLoading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          setUpdateTodoStatus={setUpdateTodoStatus}
          setDeleteItemFromTodos={setDeleteItemFromTodos}
          setError={setError}
          loading={loading}
          setLoading={setLoading}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key="tempTodo"
          setUpdateTodoStatus={setUpdateTodoStatus}
          setDeleteItemFromTodos={setDeleteItemFromTodos}
          setError={setError}
          isTemp
          loading={loading}
          setLoading={setLoading}
        />
      )}
    </section>
  );
};
