import { FC } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo:Todo | null;
  onDelete:(todoId: number) => void;
  onCheck: (id: number, status: boolean) => void;
  loadingIds:number[];
}

export const TodoList: FC<Props> = ({
  todos,
  tempTodo,
  onCheck,
  onDelete,
  loadingIds,
}) => (
  <section className="todoapp__main">
    {todos?.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        loadingIds={loadingIds}
        onCheck={onCheck}
        onDelete={onDelete}
      />
    ))}

    {tempTodo && (
      <TodoItem
        key={tempTodo.id}
        todo={tempTodo}
        loadingIds={loadingIds}
        onCheck={onCheck}
        onDelete={onDelete}
      />
    )}

  </section>
);
