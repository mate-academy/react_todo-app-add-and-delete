import { Todo } from '../types/Todo';
import { TodoItem } from './todoItem';

interface Props {
  todos: Todo[];
  loading: number[] | null;
  onDelete?: (id: number[]) => void;
  tempTodo: Todo | null;
  onPatch: (id: number, data: Partial<Todo>) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  loading,
  onDelete,
  tempTodo,
  onPatch,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loading={loading}
          onDelete={onDelete}
          onPatch={onPatch}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={tempTodo.id}
          loading={loading}
          onDelete={onDelete}
          onPatch={onPatch}
        />
      )}
    </section>
  );
};
