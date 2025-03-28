/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoField } from '../TodoField';

type Props = {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  setIsLoaded: (id: number[]) => void;
  isLoaded: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  isLoaded,
  setIsLoaded,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoField
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          isLoaded={isLoaded}
          setIsLoaded={setIsLoaded}
        />
      ))}

      {tempTodo && (
        <TodoField
          key={tempTodo.id}
          todo={tempTodo}
          deleteTodo={() => {}}
          isLoaded={[0]}
          setIsLoaded={() => {}}
        />
      )}
    </section>
  );
};
