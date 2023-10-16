import {
  Dispatch, SetStateAction, useEffect, useState,
} from 'react';
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
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);

  useEffect(() => {
    switch (status) {
      case Status.all:
        setVisibleTodos(todos);
        break;

      case Status.active:
        setVisibleTodos(todos.filter(todo => !todo.completed));
        break;

      case Status.completed:
        setVisibleTodos(todos.filter(todo => todo.completed));
        break;

      default:
        setVisibleTodos(todos);
        break;
    }
  }, [todos, status]);

  return (
    <div>
      {visibleTodos.map(todo => (
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
