import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  edited: Todo | null,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setError: React.Dispatch<React.SetStateAction<Errors | null>>,
  deletionId: number | null,
  setDeletionId: React.Dispatch<React.SetStateAction<number | null>>,
};

export const TodoList: React.FC<Props> = ({
  todos,
  edited,
  setTodos,
  setError,
  deletionId,
  setDeletionId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          edited={edited}
          isTemp={false}
          setTodos={setTodos}
          todos={todos}
          setError={setError}
          deletionId={deletionId}
          setDeletionId={setDeletionId}
        />
      ))}
    </section>
  );
};
