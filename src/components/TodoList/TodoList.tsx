import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todo/TodoItem';

type Props = {
  todos: Todo[],
  onDelete: (todoId: number) => void,
  deletingDataIds: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  deletingDataIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">

      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          isDeleting={deletingDataIds.includes(todo.id)}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
};
