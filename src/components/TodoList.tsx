/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete?: (id: number) => void;
  tempTodo: null | Todo;
  isLoading: boolean;
  processingIds?: number[] | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete = () => {},
  tempTodo,
  isLoading,
  processingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          processingIds={processingIds}
        />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} isLoading={isLoading} />}
    </section>
  );
};
