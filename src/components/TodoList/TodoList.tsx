import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onDelete?: (id: number[]) => void;
  tempTodo: Todo | null;
  deletedTodo: number[];
  adding: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete = () => {},
  deletedTodo,
  tempTodo,
  adding,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={() => onDelete([todo.id])}
          deletedTodo={deletedTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={tempTodo.id}
          onDelete={() => onDelete([tempTodo.id])}
          deletedTodo={deletedTodo}
          adding={adding}
        />
      )}
    </section>
  );
};
