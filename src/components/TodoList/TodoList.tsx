import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type TodoListProps = {
  onDeleteTodo: (id: number) => void;
  todos: Todo[];
  isLoadingChange: boolean;
  deleteTodoId: number | null;
  cleanCompleted: boolean;
  tempTodo: Todo | null;
};

export function TodoList({
  onDeleteTodo,
  todos,
  isLoadingChange,
  deleteTodoId,
  cleanCompleted,
  tempTodo,
}: TodoListProps) {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          isLoadingChange={isLoadingChange}
          deleteTodoId={deleteTodoId}
          key={todo.id}
          cleanCompleted={cleanCompleted}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          isLoadingChange={isLoadingChange}
          deleteTodoId={deleteTodoId}
          key={tempTodo.id}
          cleanCompleted={cleanCompleted}
          isAdding={TodoItem !== null}
        />
      )}
    </section>
  );
}
