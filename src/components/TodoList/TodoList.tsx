import { ErrorType } from '../../types/Error';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  deletingIds: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<ErrorType | null>>;
  setDeletingIds: React.Dispatch<React.SetStateAction<number[]>>;
}
export const TodoList: React.FC<Props> = ({
  todos,
  deletingIds,
  setTodos,
  setError,
  setDeletingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          isTemp={false}
          deletingIds={deletingIds}
          setTodos={setTodos}
          setError={setError}
          setDeletingIds={setDeletingIds}
          key={todo.id}
        />
      ))}
    </section>
  );
};
