import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodos: Todo[];
  TodoDeleteButton: (todoId: number) => void;
  isLoading: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  TodoDeleteButton,
  isLoading,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          todo={todo}
          TodoDeleteButton={TodoDeleteButton}
          isLoading={isLoading}
          key={todo.id}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          TodoDeleteButton={TodoDeleteButton}
          isLoading={isLoading}
          key={tempTodo.id}
        />
      )}
    </section>
  );
};
