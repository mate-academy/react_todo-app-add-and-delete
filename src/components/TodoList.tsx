import {
  Dispatch, SetStateAction, useEffect, useState,
} from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import { Loader } from './Loader';
import { ErrorTypes } from '../types/ErrorTypes';

type Props = {
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  tempTodo: Todo | null,
  setError: Dispatch<SetStateAction<ErrorTypes | null>>,
};

export const TodoList:React.FC<Props> = ({
  todos, setTodos, tempTodo, setError,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tempTodo) {
      setLoading(true);
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [tempTodo]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo, index) => (
        <TodoItem
          index={index}
          setTodos={setTodos}
          todo={todo}
          id={todo.id}
          key={todo.id}
          setError={setError}
        />
      ))}
      {loading && <Loader />}
      {tempTodo && !loading && (
        <TodoItem
          setTodos={setTodos}
          todo={tempTodo}
          id={tempTodo.id}
          setError={setError}
        />
      )}
    </section>
  );
};
