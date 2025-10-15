import { FC } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  visibleTodos: Todo[];
  removeTodo: (id: number) => void;
  loadingIds: number[];
}

export const TodoList: FC<Props> = ({
  visibleTodos,
  removeTodo,
  loadingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          todo={todo}
          removeTodo={removeTodo}
          loadingIds={loadingIds}
          key={todo.id}
        />
      ))}
    </section>
  );
};
