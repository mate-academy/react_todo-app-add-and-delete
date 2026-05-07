import { Todo } from '../api/types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  deletingIds: number[];
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deletingIds,
  onDelete,
  onToggle,
}) => {
  return (
    <>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isDeleting={deletingIds.includes(todo.id)}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </>
  );
};
