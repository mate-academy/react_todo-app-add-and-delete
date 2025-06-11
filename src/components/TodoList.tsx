import { ActiveLink } from '../types/ActiveLink';
import { ErrorMessage } from '../types/ErrorMessage';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (e: ErrorMessage) => void;
  activeLink: ActiveLink;
  loadingIds: number[];
  setLoadingIds: (ids: number[]) => void;
  focusInput: () => void;
};

export const TodoList = ({
  todos,
  tempTodo,
  setTodos,
  setErrorMessage,
  loadingIds,
  setLoadingIds,
  activeLink,
  focusInput,
}: Props) => {
  const filteredTodos = todos.filter(todo => {
    switch (activeLink) {
      case ActiveLink.All:
        return true;
      case ActiveLink.Active:
        return !todo.completed;
      case ActiveLink.Completed:
        return todo.completed;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loadingIds={loadingIds}
          setLoadingIds={setLoadingIds}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          focusInput={focusInput}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          loadingIds={[0]}
          setLoadingIds={setLoadingIds}
          focusInput={focusInput}
        />
      )}
    </section>
  );
};
