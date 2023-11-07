import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  onDelete: (v: number) => void,
  tempTodo: Todo | null,
};

export const Main: React.FC<Props> = ({ todos, onDelete, tempTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={tempTodo.id}
          onDelete={onDelete}
        />
      )}
    </section>
  );
};
