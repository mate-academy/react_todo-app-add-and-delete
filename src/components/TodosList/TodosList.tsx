import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { ErrorMessage } from '../../types/ErrorMessages';

type TodosListProps = {
  todos: Todo[];
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  setProcessingIds: React.Dispatch<React.SetStateAction<number[]>>;
  processingIds: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage?: (errorMessage: ErrorMessage) => void;
  focusInput?: () => void;
};

export const TodosList = ({
  todos,
  filteredTodos,
  tempTodo,
  setProcessingIds,
  processingIds,
  setTodos,
  setErrorMessage,
  focusInput,
}: TodosListProps) => {
  return (
    <>
      {todos.length > 0 && (
        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              todo={todo}
              key={todo.id}
              setProcessingIds={setProcessingIds}
              processingIds={processingIds}
              setTodos={setTodos}
              setErrorMessage={setErrorMessage}
              focusInput={focusInput}
            />
          ))}
          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              processingIds={processingIds}
              setProcessingIds={setProcessingIds}
            />
          )}
        </section>
      )}
    </>
  );
};
