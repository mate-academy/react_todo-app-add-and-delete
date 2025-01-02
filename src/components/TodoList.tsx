import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodos: Todo[];
  setError: (message: string) => void;
  loading: number | null;
  deleteTodo: (id: number) => void;
  updateTodoCheck: (id: number) => void;
  updateTodoTitle: (event: React.FormEvent, id: number, value: string) => void;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  setError,
  loading,
  deleteTodo,
  updateTodoCheck,
  updateTodoTitle,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          setError={setError}
          loading={loading}
          deleteTodo={deleteTodo}
          updateTodoCheck={updateTodoCheck}
          updateTodoTitle={updateTodoTitle}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          setError={setError}
          loading={loading}
          deleteTodo={deleteTodo}
          updateTodoCheck={updateTodoCheck}
          updateTodoTitle={updateTodoTitle}
        />
      )}
    </section>
  );
};
