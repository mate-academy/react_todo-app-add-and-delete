import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  removeTodo: (todoId: number) => void,
  isLoading: boolean,
  deletingTodosIds: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  isLoading,
  deletingTodosIds,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          removeTodo={removeTodo}
          isLoading={isLoading}
          isDeleting={deletingTodosIds.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          isLoading={isLoading}
          removeTodo={removeTodo}
          isDeleting={deletingTodosIds.includes(tempTodo.id)}
        />
      )}
    </section>
  );
};
