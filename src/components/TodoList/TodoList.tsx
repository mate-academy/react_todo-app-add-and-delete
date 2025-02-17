import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  processedTodosIds: number[];
  deleteTodo: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  processedTodosIds,
  deleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isProcessed={processedTodosIds.includes(todo.id)}
          deleteTodo={deleteTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem todo={tempTodo} isProcessed={true} deleteTodo={deleteTodo} />
      )}
    </section>
  );
};
