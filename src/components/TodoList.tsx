import React from 'react';
import { Todo } from '../types/Todo';
import { Todos } from './Todo';

type Props = {
  todos: Todo[],
  title:string
  isAdding:boolean,
  deleteTodo:(param: number) => void,
  loadingTodoIds: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  title,
  isAdding,
  deleteTodo,
  loadingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">

      {todos.map((todo) => (
        <Todos
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          loadingTodoIds={loadingTodoIds}
          isAdding={isAdding}
        />
      ))}

      {isAdding && (
        <Todos
          key={Math.random()}
          todo={{
            id: 0,
            title,
            completed: false,
            userId: Math.random(),
          }}
          deleteTodo={deleteTodo}
          loadingTodoIds={loadingTodoIds}
          isAdding={isAdding}
        />
      )}

    </section>
  );
};
