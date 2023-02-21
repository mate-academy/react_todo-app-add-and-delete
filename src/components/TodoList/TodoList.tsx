import React from 'react';
import { ErrorType } from '../../types/ErrorType';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  userId: number,
  fetchTodos: (userId: number) => void,
  changeHasError: (typeError: ErrorType) => void,
  changeIsError: () => void,
  tempTodo: Todo | null,
};

export const TodoList: React.FC<Props> = ({
  todos,
  userId,
  fetchTodos,
  changeHasError,
  changeIsError,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          userId={userId}
          fetchTodos={fetchTodos}
          changeHasError={changeHasError}
          changeIsError={changeIsError}
        />
      ))}

      {tempTodo !== null && (
        <TodoItem
          todo={tempTodo}
          userId={userId}
          fetchTodos={fetchTodos}
          changeHasError={changeHasError}
          changeIsError={changeIsError}
        />
      )}

    </section>
  );
};
