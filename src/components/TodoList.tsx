import { Todo } from '../types/Todo';
import { TodoInfo } from './Todo';

interface Props {
  todos: Todo[];
  setTodos: any,
  setError: any,
  isLoading: boolean,
}

export const TodoList: React.FC<Props> = ({
  todos,
  setError,
  setTodos,
  isLoading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(({ id, completed, title }) => (
        <TodoInfo
          key={id}
          title={title}
          completed={completed}
          id={id}
          setError={setError}
          setTodos={setTodos}
          todos={todos}
          isLoading={isLoading}
        />
      ))}
    </section>
  );
};
