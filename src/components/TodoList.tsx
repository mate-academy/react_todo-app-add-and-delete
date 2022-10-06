import React from 'react';
import { Todo } from '../types/Todo';
import { NewTodo } from './Todo';

type Props = {
  todos: Todo[],
  isLoading: boolean,
  title:string
  isAdding:boolean,
  deleteTodo:(param: number) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  isLoading,
  title,
  isAdding,
  deleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">

      {todos.map((todo) => (
        <NewTodo
          key={todo.id}
          todo={todo}
          isLoading={isLoading}
          deleteTodo={deleteTodo}
        />
      ))}

      {isAdding && (
        <NewTodo
          key={Math.random()}
          todo={{
            id: 0,
            title,
            completed: false,
            userId: Math.random(),
          }}
          isLoading={isLoading}
          deleteTodo={deleteTodo}
        />
      )}

    </section>
  );
};
