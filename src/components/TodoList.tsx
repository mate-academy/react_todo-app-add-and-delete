import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[]
  deleteTodoHandler: (todoId: number) => void;
  tempTodo: Todo | null;
};

export const Todolist: React.FC<Props> = (
  { todos, deleteTodoHandler, tempTodo },
) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          tempTodo={tempTodo}
          deleteTodoHandler={deleteTodoHandler}
          todo={todo}
          key={todo.id}
        />
      ))}
    </section>
  );
};
