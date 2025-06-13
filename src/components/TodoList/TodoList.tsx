/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (todoId: number) => void;
  pendingTodoIds: Set<number>;
}
export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  onDelete,
  pendingTodoIds,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDelete={() => onDelete(todo.id)}
        isLoading={pendingTodoIds.has(todo.id)}
      />
    ))}
    {tempTodo && (
      <TodoItem key={tempTodo.id} todo={tempTodo} isTemp isLoading={true} />
    )}
  </section>
);
