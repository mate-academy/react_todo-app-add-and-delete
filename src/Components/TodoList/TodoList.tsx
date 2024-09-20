import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodoTitle: string | null;
  loadingId: number | null;
  onDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodoTitle,
  loadingId,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            loadingId={loadingId}
            onDelete={onDelete}
          />
        );
      })}

      {tempTodoTitle && (
        <TodoItem
          todo={{ id: 0, userId: 0, title: tempTodoTitle, completed: false }}
          loadingId={0}
        />
      )}
    </section>
  );
};
