import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  isTempLoading: boolean,
  setTodos: (todos: Todo[]) => void,
  showError: (title: string) => void,
  toBeCleared: Todo[],
};

export const Main: React.FC<Props> = ({
  todos,
  tempTodo,
  isTempLoading,
  showError,
  setTodos,
  toBeCleared,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (

        <TodoItem
          key={todo.id}
          todo={todo}
          todos={todos}
          showError={showError}
          setTodos={setTodos}
          toBeCleared={toBeCleared}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isTempLoading={isTempLoading}
        />
      )}
    </section>
  );
};
