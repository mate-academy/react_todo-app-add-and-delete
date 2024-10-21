import { FC } from 'react';
import { Todo } from '../types';
import { TodoInfo } from './index';

type Props = {
  todos: Todo[];
  loadingTodoIds: number[];
  onDelete: (todoId: number) => Promise<void>;
};

export const TodoList: FC<Props> = ({ todos, loadingTodoIds, onDelete }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          loadingTodoIds={loadingTodoIds}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
};
