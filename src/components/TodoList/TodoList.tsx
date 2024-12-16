import { Todo } from '../../types/Todo';
import { Errors } from '../../utils/Errors';
import { TodoCard } from '../TodoCard/TodoCard';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  isDeleting: boolean;
  setIsDeleting: (isDeleting: boolean) => void;
  setTodos: (todos: Todo[]) => void;
  setHasError: (hasError: Errors) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}
export const TodoList: React.FC<Props> = props => {
  const {
    todos,
    tempTodo,
    isDeleting,
    setIsDeleting,
    setTodos,
    setHasError,
    inputRef,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoCard
            key={todo.id}
            title={todo.title}
            isCompleted={todo.completed}
            isTempTodo={false}
            isDeleting={isDeleting}
            todoId={todo.id}
            setIsDeleting={setIsDeleting}
            todos={todos}
            setTodos={setTodos}
            setHasError={setHasError}
            inputRef={inputRef}
          />
        );
      })}
      {tempTodo && (
        <TodoCard
          title={tempTodo.title}
          isCompleted={false}
          isTempTodo={true}
          todoId={tempTodo.id}
          isDeleting={isDeleting}
          setIsDeleting={setIsDeleting}
          todos={todos}
          setTodos={setTodos}
          setHasError={setHasError}
          inputRef={inputRef}
        />
      )}
    </section>
  );
};
