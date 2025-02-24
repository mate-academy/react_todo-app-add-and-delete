import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  tempTodo?: Todo | null;
  isLoading: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  tempTodo,
  isLoading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} onDelete={onDelete} />
      ))}

      {tempTodo && (
        <TodoItem todo={tempTodo} onDelete={onDelete} isLoading={isLoading} />
      )}
    </section>
  );
};
