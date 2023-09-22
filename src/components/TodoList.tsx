import React from 'react';
import { Todo, Error } from '../types/Index';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  setTodos: (value: Todo[]) => void,
  tempTodo: Todo | null,
  filteredTodos: Todo[],
  hasTodoLoading: boolean,
  setHasError: (value: Error) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  tempTodo,
  filteredTodos,
  hasTodoLoading,
  setHasError,
}) => {
  return (
    <section className="todoapp__main">
      {filteredTodos.map(todo => (
        <TodoItem
          todos={todos}
          setTodos={setTodos}
          todo={todo}
          key={todo.id}
          setHasError={setHasError}
        />
      ))}
      {tempTodo
        && (
          <TodoItem
            todo={tempTodo}
            hasTodoLoading={hasTodoLoading}
            setHasError={setHasError}
          />
        )}
    </section>
  );
};
