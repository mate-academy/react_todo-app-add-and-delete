import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { Error } from '../../types/Error';

interface Props {
  todos: Todo[];
  deleteIds: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
  setDeleteIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  deleteIds,
  setTodos,
  setError,
  setDeleteIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          isTemp={false}
          deleteIds={deleteIds}
          setTodos={setTodos}
          setError={setError}
          setDeleteIds={setDeleteIds}
          key={todo.id}
        />
      ))}
    </section>
  );
};
