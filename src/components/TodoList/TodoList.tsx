import React, { FC } from 'react';
import { TodoTask } from '../TodoTask';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/Error';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  processings: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
  setProcessings: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodoList: FC<Props> = ({
  filteredTodos,
  tempTodo,
  processings,
  setTodos,
  setError,
  setProcessings,
}) => {
  return (
    <section className="todoapp__main">
      {filteredTodos.map(todo => (
        <TodoTask
          key={todo.id}
          todo={todo}
          setTodos={setTodos}
          setError={setError}
          isLoading={processings.includes(todo.id)}
          setProcessings={setProcessings}
        />
      ))}

      {tempTodo && (
        <TodoTask
          todo={tempTodo}
          setTodos={setTodos}
          setError={setError}
          isLoading={processings.includes(tempTodo.id)}
          setProcessings={setProcessings}
        />
      )}
    </section>
  );
};
