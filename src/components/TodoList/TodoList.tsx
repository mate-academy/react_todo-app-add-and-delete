import { TodoInfo } from '../TodoInfo/TodoInfo';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
  todosToDelete: number[];
  setTodosToDelete: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  setTodos,
  setErrorMessage,
  inputRef,
  todosToDelete,
  setTodosToDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          key={todo.id}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          inputRef={inputRef}
          todosToDelete={todosToDelete}
          setTodosToDelete={setTodosToDelete}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          isTemp={true}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          inputRef={inputRef}
          todosToDelete={todosToDelete}
          setTodosToDelete={setTodosToDelete}
        />
      )}
    </section>
  );
};
