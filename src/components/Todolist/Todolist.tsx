import { TodoItem } from '../../types/Todo';
import { Todo } from '../Todo/Todo';

type Props = {
  visibleTodos: TodoItem[];
  todos: TodoItem[];
  setTodos: (todos: TodoItem[]) => void;
  setErrorMessage: (message: string) => void;
  onDeleteTodo: (id: number) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Todolist: React.FC<Props> = ({
  visibleTodos,
  setErrorMessage,
  onDeleteTodo,
  inputRef,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          setErrorMessage={setErrorMessage}
          onDeleteTodo={onDeleteTodo}
          inputRef={inputRef}
        />
      ))}
    </section>
  );
};
