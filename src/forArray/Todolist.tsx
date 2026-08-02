import { Todo } from '../types/Todo';
import React from 'react';
import { Todofile } from '../Todofile/Todofile';

interface Props {
  todos: Todo[];
  onselect: (todo: number) => void;
  Updated: (todo: Todo) => void;
  tempTodo?: Todo | null;
  loadingTodoIds?: number[];
}

export const Todolist: React.FC<Props> = ({
  todos = [],
  onselect,
  Updated,
  tempTodo,
  loadingTodoIds = [],
}) => {
  return (
    <>
      {todos.map(todo => (
        <Todofile
          key={todo.id}
          todo={todo}
          onSelect={onselect}
          updated={Updated}
          isLoading={loadingTodoIds.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <Todofile
          key={tempTodo.id}
          todo={tempTodo}
          onSelect={onselect}
          updated={Updated}
          isLoading={true}
        />
      )}
    </>
  );
};
