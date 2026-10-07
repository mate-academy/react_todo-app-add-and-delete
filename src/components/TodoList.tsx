import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  currentTodo: Todo | null;
  loadingIds: number[];
  onDelete: (todoId: number) => Promise<boolean>;
};
export const TodoList: React.FC<Props> = ({
  todos,
  currentTodo = null,
  loadingIds,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={loadingIds.includes(todo.id)}
          onDelete={onDelete}
        />
      ))}
      {currentTodo && <TodoItem todo={currentTodo} isLoading={true} />}
    </section>
  );
};
