import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  isLoading?: boolean;
  isAdding?: boolean;
  onDelete: (id: number) => void;
  deletingId?: number | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  deletingId,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            isLoading={isAdding && todo.id === 0}
            isDeleting={deletingId === todo.id}
            onDelete={onDelete}
          />
        );
      })}
    </section>
  );
};
