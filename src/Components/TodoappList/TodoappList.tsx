import { Todo } from '../../types/Todo';
import { TodoappItem } from '../TodoappItem/TodoappItem';

type Props = {
  todos: Todo[],
  handleDelete: (id: number) => Promise<void>;
  temporaryTodo: Todo | null,
  setTodosError: (error: string) => void;
  processingTodoIds: number[];
};

export const TodoappList: React.FC<Props> = ({
  todos,
  handleDelete,
  temporaryTodo,
  setTodosError,
  processingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoappItem
          todo={todo}
          key={todo.id}
          handleDelete={() => handleDelete(todo.id)}
          setTodosError={setTodosError}
          isLoading={processingTodoIds.includes(todo.id)}
        />
      ))}

      {temporaryTodo && (
        <TodoappItem
          todo={temporaryTodo}
          handleDelete={() => handleDelete(0)}
          setTodosError={setTodosError}
          isLoading={processingTodoIds.includes(0)}
        />
      )}
    </section>
  );
};
