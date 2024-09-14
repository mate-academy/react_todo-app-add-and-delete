import { ErrorMessage } from '../../types/ErrorMessage';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (todoId: number) => void;
  onSetErrorMessage: (message: ErrorMessage | null) => void;
  isSubmitting: boolean;
}

export const TodoList = ({
  todos,
  onDelete,
  tempTodo,
  onSetErrorMessage,
  isSubmitting,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onSetErrorMessage={onSetErrorMessage}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          onDelete={onDelete}
          isSubmitting={isSubmitting}
          onSetErrorMessage={onSetErrorMessage}
        />
      )}
    </section>
  );
};
