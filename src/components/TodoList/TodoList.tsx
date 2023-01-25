import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[],
  onDeleteTodo: (todoId: number) => void,
  isLoading: boolean
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  isLoading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          isLoading={isLoading}
        />
      ))}
    </section>
  );
};
