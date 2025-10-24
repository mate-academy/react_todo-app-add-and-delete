/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../../types/Todo';
import { TodoItem } from '../../components/TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  selectedTodoId?: number;
  processingIds: number[];
  onDelete?: (id: number) => void;
};

export const TodosList = ({
  todos,
  selectedTodoId,
  processingIds,
  onDelete,
}: Props) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        selectedTodoId={selectedTodoId}
        isProcessed={processingIds.includes(todo.id)}
        onDelete={() => onDelete?.(todo.id)}
      />
    ))}
  </section>
);
