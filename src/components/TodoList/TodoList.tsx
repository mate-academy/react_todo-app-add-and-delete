import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (message: string) => void;
  loadingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  setErrorMessage,
  loadingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <ul>
        {todos.map(todo => (
          <TodoInfo
            key={todo.id}
            todo={todo}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
            loadingTodoIds={loadingTodoIds}
          />
        ))}
      </ul>
    </section>
  );
};
