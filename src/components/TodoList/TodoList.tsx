/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoField } from '../TodoField';

type Props = {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  setIsLoadedIDs: (id: number[]) => void;
  isLoadedIDs: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  isLoadedIDs,
  setIsLoadedIDs,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoField
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          isLoadedIDs={isLoadedIDs}
          setIsLoadedIDs={setIsLoadedIDs}
        />
      ))}

      {tempTodo && (
        <TodoField
          key={tempTodo.id}
          todo={tempTodo}
          deleteTodo={() => {}}
          isLoadedIDs={[0]}
          setIsLoadedIDs={() => {}}
        />
      )}
    </section>
  );
};
