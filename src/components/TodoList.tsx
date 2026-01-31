import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  filteredTodos: Todo[];
  onDeleteTodo: (id: number) => void;
  loadingIds: number[];
}

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  onDeleteTodo,
  loadingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          isLoading={loadingIds.includes(todo.id)}
        />
      ))}
    </section>
  );
};
