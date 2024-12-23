import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodos: Todo[];
  onDeleteTodo: (todoId: number) => void;
  loadingTodos: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = props => {
  const { filteredTodos, onDeleteTodo, loadingTodos, tempTodo } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          isLoading={loadingTodos.includes(todo.id)}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDeleteTodo={() => {}}
          isLoading={loadingTodos.includes(tempTodo.id)}
        />
      )}
    </section>
  );
};
