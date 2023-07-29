import { Todo } from '../types/Todo';
import { Error } from '../types/Error';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onTodosChange: (todos: Todo[]) => void;
  tempTodo: Todo | null,
  onErrorChange: (error: Error) => void;
  loadingTempTodo: boolean,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onTodosChange,
  tempTodo,
  onErrorChange,
  loadingTempTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          todos={todos}
          onTodosChange={onTodosChange}
          onErrorChange={onErrorChange}
          key={todo.id}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          loadingTempTodo={loadingTempTodo}
        />
      )}
    </section>
  );
};
