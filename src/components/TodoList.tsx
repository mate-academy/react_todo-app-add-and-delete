import { Todo } from '../types/Todo';
import { TodoListItem } from './TodoListItem';

type Props = {
  todos: Todo[],
  onDelete: (todoId: number) => void,
  deletingIds: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  deletingIds,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          deletingIds={deletingIds}
        />
      ))}
    </section>
  );
};
