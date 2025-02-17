import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete?: (todoId: number) => void;
  loadingTodos: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  loadingTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={loadingTodos.includes(todo.id)}
        />
      ))}
      {tempTodo && (
        <TodoItem todo={tempTodo} isLoading={loadingTodos.includes(0)} />
      )}
    </section>
  );
};
