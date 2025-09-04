/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type TodoListProps = {
  todos: Todo[];
  tempTodo?: Todo | null;
  loading?: boolean;
  onDelete: (todoId: number) => void;
  todosToDelete?: Set<number>;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  loading,
  onDelete,
  todosToDelete,
}) => {
  const displayTodos = tempTodo ? [...todos, tempTodo] : todos;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This todo is an active todo */}
      {displayTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loading={
            loading && (todo.id === tempTodo?.id || todosToDelete?.has(todo.id))
          }
          onDelete={onDelete}
        />
      ))}
    </section>
  );
};
