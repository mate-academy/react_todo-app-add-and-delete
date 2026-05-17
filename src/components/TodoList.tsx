import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onToggle: (id: number) => void;
  handleDelete: (id: number) => void;
  deletingIds: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onToggle,
  handleDelete,
  deletingIds,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={handleDelete}
          isDeleting={deletingIds.includes(todo.id)}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onToggle={() => {}}
          onDelete={() => {}}
          isDeleting
        />
      )}
    </section>
  );
};
