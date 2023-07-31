import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[],
  tempTodo: Todo | null,
  setTodos: (todo: Todo[]) => void,
  setErrorMessage: (msg: string) => void,
}

export const TodoMain: React.FC<Props> = ({
  todos,
  tempTodo,
  setTodos,
  setErrorMessage,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          todo={todo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
        />
      )}

    </section>
  );
};
