import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[],
  onDeleteTodo: (todoId: number) => void,
  isLoading: boolean,
  deletingTodosIds: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  isLoading,
  deletingTodosIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          isLoading={isLoading}
          isDeleting={deletingTodosIds.includes(todo.id)}
        />
      ))}
    </section>
  );
};
