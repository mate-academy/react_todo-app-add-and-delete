import { FC } from 'react';

import { Todo } from '../../types';

import { TodoItem } from '..';

interface ITodoList {
  todos: Todo[];
}

export const TodoList: FC<ITodoList> = ({ todos }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
    </section>
  );
};
