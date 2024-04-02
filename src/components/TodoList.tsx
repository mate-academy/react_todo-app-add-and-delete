import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  preparedTodos: Todo[];
  isLoading: boolean;
  tempTodo: null | Todo;
  deleteTodo: (id: number) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  preparedTodos,
  isLoading,
  tempTodo,
  deleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {preparedTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} deleteTodo={deleteTodo} />
      ))}

      {tempTodo && (
        <>
          <TodoItem
            key={tempTodo.id}
            todo={tempTodo}
            isLoading={isLoading}
            deleteTodo={deleteTodo}
          />
        </>
      )}
    </section>
  );
};
