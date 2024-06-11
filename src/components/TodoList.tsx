import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  loadingTodoIds?: number[];
  handleToggleTodo: (id: number) => void;
  onDeleteTodo?: (currentTodoId: number) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoIds,
  handleToggleTodo = () => {},
  onDeleteTodo = () => {},
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onloadingTodoIds={loadingTodoIds}
          handleToggleTodo={handleToggleTodo}
          handleTodoDelete={onDeleteTodo}
        />
      ))}
    </section>
  );
};
