import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  isDeleting: (id: number) => void;
  areAllRemoving: boolean;
};

export const TodoList: FC<Props> = ({
  todos,
  isDeleting,
  areAllRemoving,
}) => (
  <section className="todoapp__main">
    {todos.map((todo) => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isDeleting={isDeleting}
        areAllRemoving={areAllRemoving}
      />
    ))}
  </section>
);
