/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete?: (id: number) => void;
  tempTodo: null | Partial<Todo>;
  isLoading: boolean;
  deletedTodo?: Todo[] | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete = () => {},
  tempTodo,
  isLoading,
  deletedTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          deletedTodo={deletedTodo}
          isLoading={isLoading}
        />
      ))}
      {tempTodo && <TodoItem tempTodo={tempTodo} isLoading={isLoading} />}
    </section>
  );
};
