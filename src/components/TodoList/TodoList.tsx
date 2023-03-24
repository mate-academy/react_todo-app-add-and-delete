import { FC } from 'react';
import type { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  onDelete: (id: number) => void;
  todos: Todo[];
};

export const TodoList: FC<Props> = ({ onDelete, todos }) => {
  return (
    <section className="">
      {todos.map((todo) => (
        <TodoItem todo={todo} key={todo.id} onDelete={onDelete} />
      ))}
    </section>
  );
};
