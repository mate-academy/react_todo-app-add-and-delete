import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  visibleTodos: Todo[];
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  isLoading: boolean;
  tempAddedTodo: Todo | null;
  deletedIds: number[];
}

export const TodoList = ({
  visibleTodos,
  toggleTodo,
  deleteTodo,
  tempAddedTodo,
  deletedIds,
}: TodoListProps) => {
  return (
    <div data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          isLoading={deletedIds.includes(todo.id)}
        />
      ))}
      {tempAddedTodo && (
        <TodoItem
          key={tempAddedTodo.id}
          todo={tempAddedTodo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          isLoading={true}
        />
      )}
    </div>
  );
};
