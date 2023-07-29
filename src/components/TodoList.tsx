import React from 'react';
import { Todo, Error } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  setTodos: (value: Todo[]) => void,
  tempTodo: Todo | null,
  filteredTodos: Todo[],
  isNewTodoLoading: boolean,
  setHasError: (value: Error) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  tempTodo,
  filteredTodos,
  isNewTodoLoading,
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
            isNewTodoLoading={isNewTodoLoading}
            setHasError={setHasError}
          />
        )}
    </section>
  );
};
