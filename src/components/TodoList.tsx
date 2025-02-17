import { ErrorMessage } from '../types/ErrorMessage';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  fetchData: () => void;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorMessage | string>>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  fetchData,
  setErrorMessage,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          fetchData={fetchData}
          setErrorMessage={setErrorMessage}
        />
      ))}
    </section>
  );
};
