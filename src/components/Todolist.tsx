import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';

type Props = {
  todos: Todo[],
  deletingTodosIds: number[],
  temporaryTodo: Todo | null,
  handleDeleteTodo: (id: number) => void,
};

export const Todolist: React.FC<Props> = ({
  todos,
  deletingTodosIds,
  temporaryTodo,
  handleDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          deletingTodosIds={deletingTodosIds}
        />
      ))}

      {temporaryTodo && (
        <TodoInfo
          todo={temporaryTodo}
          handleDeleteTodo={handleDeleteTodo}
          deletingTodosIds={deletingTodosIds}
        />
      )}
    </section>
  );
};
