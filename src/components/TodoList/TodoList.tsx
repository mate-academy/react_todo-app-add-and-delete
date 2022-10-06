import { FC } from 'react';
import { TodoItem } from '../TodoItem';

import { Props } from './TodoList.props';

export const TodoList: FC<Props> = ({ todos }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </section>
  );
};
