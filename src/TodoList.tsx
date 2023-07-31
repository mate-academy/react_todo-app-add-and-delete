import React from 'react';
import { Todo } from './types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[]
  deleteTodoHandler: (todoId: number) => void;
  processing: boolean;
};

export const Todolist: React.FC<Props> = (
  { todos, deleteTodoHandler, processing },
) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          processing={processing}
          deleteTodoHandler={deleteTodoHandler}
          todo={todo}
          key={todo.id}
        />
      ))}
    </section>
  );
};
