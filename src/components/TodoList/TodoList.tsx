import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItems } from '../TodoItems/TodoItems';

type Props = {
  todos: Todo[];
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItems todo={todo} />
      ))}
    </section>
  );
};
