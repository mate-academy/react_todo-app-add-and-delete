import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingItemIds: number[];
  handleDelete: (todoId: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingItemIds,
  handleDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          isLoading={loadingItemIds.includes(todo.id)}
          handleDelete={handleDelete}
          key={todo.id}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading={loadingItemIds.includes(tempTodo.id)}
          handleDelete={handleDelete}
          key={tempTodo.id}
        />
      )}
    </section>
  );
};
