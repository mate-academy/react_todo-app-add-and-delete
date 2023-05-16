import React from 'react';
import { v4 } from 'uuid';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  visibleTodos: Todo[];
  tempoTodo: Todo | null;
  setTodos: (todos: Todo[]) => void;
  setError: (error: string) => void;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempoTodo,
  setTodos,
  setError,
}) => {
  return (

    <section className="todoapp__main">
      {visibleTodos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            setTodos={setTodos}
            setError={setError}
            key={v4()}
          />
        );
      })}

      {tempoTodo && (
        <TodoItem
          todo={tempoTodo}
          setTodos={setTodos}
          setError={setError}
        />
      )}
    </section>
  );
};
