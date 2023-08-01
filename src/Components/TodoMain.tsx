import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[],
  tempTodo: Todo | null,
  setTodos: (todo: Todo[]) => void,
  setErrorMessage: (msg: string) => void,
  loading: boolean,
  completedIds: number[],
  setCompletedIds: React.Dispatch<React.SetStateAction<number[]>>,
}

export const TodoMain: React.FC<Props> = ({
  todos,
  tempTodo,
  setTodos,
  setErrorMessage,
  loading,
  completedIds,
  setCompletedIds,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          todo={todo}
          loading={loading}
          completedIds={completedIds}
          setCompletedIds={setCompletedIds}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          loading={loading}
          completedIds={completedIds}
          setCompletedIds={setCompletedIds}
        />
      )}

    </section>
  );
};
