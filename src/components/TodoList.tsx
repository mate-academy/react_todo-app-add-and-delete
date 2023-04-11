import React from 'react';
import { Todo } from '../types/Todo';
import { SingleTodo } from './SingleTodo';

interface Props {
  todos: Todo[],
  onDeleteTodo: (todoId: number) => Promise<void>
  loaded: boolean,
}

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    onDeleteTodo,
    loaded,
  }) => {
    return (
      <section className="todoapp__main">
        {todos.map(todo => (
          <SingleTodo
            todo={todo}
            key={todo.id}
            onDelete={onDeleteTodo}
            inLoading={loaded}
          />
        ))}
      </section>
    );
  },
);
