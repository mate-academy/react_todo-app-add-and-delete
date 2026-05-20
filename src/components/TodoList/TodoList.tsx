import { TodoListItem } from '../TodoListItem';
import { Todo } from '../../types/Todo';
import { Nullable } from '../../types/Nullable';

interface Props {
  todos: Todo[];
  tempTodo: Nullable<Todo>;
  onDeleteTodo: (id: Todo['id']) => void;
  pendingTodoIds: number[];
}

export const TodoList = ({
  todos,
  tempTodo,
  onDeleteTodo,
  pendingTodoIds,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          isLoading={pendingTodoIds.includes(todo.id)}
        />
      ))}
      {tempTodo && (
        <TodoListItem
          key={tempTodo.id}
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          isLoading
        />
      )}
    </section>
  );
};
