import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todoList: Todo[];
  tempTodo: Todo | null;
  deletingId: number | null;
  onDeleteClick: (id: number) => void;
};

export const TodoAppContent: React.FC<Props> = ({
  todoList,
  tempTodo,
  deletingId,
  onDeleteClick,
}) => {
  return (
    <section className="todoapp__main">
      {todoList.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deletingId={deletingId}
          onDeleteClick={onDeleteClick}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          deletingId={deletingId}
          onDeleteClick={onDeleteClick}
        />
      )}
    </section>
  );
};
