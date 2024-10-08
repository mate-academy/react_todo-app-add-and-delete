import { Todo } from '../../types/Todo';
import { TempTodo } from '../TempTodo/TempTodo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  tempTodo: Todo | null;
  isLoading: boolean;
  setErrorMessage: (errorText: string) => void;
  handleDeleteTodo: (id: number) => void;
  setloadingIds: React.Dispatch<React.SetStateAction<number[]>>;
  deletingTodoId: number | null;
  loadingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  tempTodo,
  handleDeleteTodo,
  setErrorMessage,
  deletingTodoId,
  setloadingIds,
  loadingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          handleDeleteTodo={handleDeleteTodo}
          isDeleting={deletingTodoId === todo.id}
          setloadingIds={setloadingIds}
          setTodos={setTodos}
          loadingIds={loadingIds}
          setErrorMessage={setErrorMessage}
        />
      ))}
      {tempTodo && <TempTodo todo={tempTodo} />}
    </section>
  );
};
