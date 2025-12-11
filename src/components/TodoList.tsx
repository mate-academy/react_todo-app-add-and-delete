import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  loadingTodoIds: number[];
  onChange: (todo: Todo) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
};

export const TodoList = ({
  todos,
  loadingTodoIds,
  onChange,
  onRemove,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        // const isLoading = loadingTodoIds.includes(todo.id);
        <TodoItem
          todo={todo}
          key={todo.id}
          loadingTodoIds={loadingTodoIds}
          //   isLoading={isLoading}
          onChange={onChange}
          onRemove={onRemove}
        />
      ))}
    </section>
  );
};
