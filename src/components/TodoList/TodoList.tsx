import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type TodoListProps = {
  todos: Todo[];
  tempTodo?: Todo | null; // Optional tempTodo for displaying a temporary item
  onDelete: (todoId: number) => void;
  loader?: boolean; // Optional loader prop to indicate loading state
  onToggleCompleted: (todoId: number, completed: boolean) => Promise<void>; // Function to toggle completed status
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onDelete,
  tempTodo,
  loader,
  onToggleCompleted,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteItem={onDelete}
          loader={loader && !tempTodo}
          onToggleCompleted={onToggleCompleted}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          onDeleteItem={onDelete}
          loader={loader}
          onToggleCompleted={onToggleCompleted}
        />
      )}
      {/* This is a placeholder for more todos */}
      {/* This todo is an active todo */}
      {/* This is a completed todo */}
    </section>
  );
};
