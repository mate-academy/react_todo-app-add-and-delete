import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Status } from './types/Status';
import { Todo } from './types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  status: Status,
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  setErrorMessage: Dispatch<SetStateAction<string>>,
};

export const TodoList: React.FC<Props> = ({
  todos, status, setTodos, setErrorMessage,
}) => {
  useEffect(() => {
    switch (status) {
      case Status.all:
        break;

      case Status.active:
        break;

      case Status.completed:
        break;

      default:
        break;
    }
  }, [todos, status]);

  // Filter todos based on status
  const filteredTodos = (() => {
    switch (status) {
      case Status.active:
        return todos.filter(todo => !todo.completed);

      case Status.completed:
        return todos.filter(todo => todo.completed);

      case Status.all:
      default:
        return todos;
    }
  })();

  return (
    <div>
      {filteredTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          todos={todos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
        />
      ))}
    </div>
  );
};
