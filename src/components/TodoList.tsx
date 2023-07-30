import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import { ErrorType } from '../types/Error';

type Props = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setError: (value: ErrorType) => void;
  updatingTodos: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  setError,
  updatingTodos,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          todos={todos}
          setTodos={setTodos}
          setError={setError}
          isUpdating={updatingTodos.includes(todo.id)}
          key={todo.id}
        />
      ))}
    </section>
  );
};
