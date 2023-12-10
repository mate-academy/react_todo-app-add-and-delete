import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from './types/Todo';

type Props = {
  filteredTodos: () => Todo[];
  todos: Todo[];
  setTodos: (todo: Todo[]) => void;
  tempTodo: Todo | null;
  userId: number;
  setErrorMessage: (err: string) => void;
  clearCompleted: boolean;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  todos,
  setTodos,
  tempTodo,
  userId,
  setErrorMessage,
  clearCompleted,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos().map((todo: Todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          todos={todos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          userId={userId}
          clearCompleted={clearCompleted}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          todos={todos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          userId={userId}
          clearCompleted={clearCompleted}
        />
      )}
    </section>
  );
};
