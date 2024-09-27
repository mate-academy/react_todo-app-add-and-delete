import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  setTodos: (value: React.SetStateAction<Todo[]>) => void;
  filteredTodos: Todo[];
  isLoading: number[];
  setIsLoading: React.Dispatch<React.SetStateAction<number[]>>;
  setError: (value: React.SetStateAction<string>) => void;
  setIsErrorShown: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  filteredTodos,
  isLoading,
  setIsLoading,
  setError,
  setIsErrorShown,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          todo={todo}
          todos={todos}
          setTodos={setTodos}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setError={setError}
          setIsErrorShown={setIsErrorShown}
          key={todo.id}
        />
      ))}
    </section>
  );
};
