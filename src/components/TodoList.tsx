import { Todo } from '../types/Todo';
import { TodoRow } from './TodoRow';

interface TodoListProps {
  todos: Todo[];
  onDelete: (todoId: number) => Promise<void>;
  onRename: (todo: Todo, newTitle: string) => Promise<void>;
  onToggle: (todo: Todo) => Promise<void>;
  onError?: (message: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onDelete,
  onRename,
  onToggle,
  onError,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoRow
        todo={todo}
        key={todo.id}
        onDelete={() => onDelete(todo.id)}
        onRename={(newTitle: string) => onRename(todo, newTitle)}
        onToggle={() => onToggle(todo)}
        onError={onError}
      />
    ))}
  </section>
);
