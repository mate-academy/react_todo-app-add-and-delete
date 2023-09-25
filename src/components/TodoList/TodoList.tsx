import { Todo } from '../../types/Todo';
import { TempTodo } from '../TempTodo/TempTodo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  removeTodo: (id: number) => void,
  isLoading: boolean,
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  removeTodo,
  isLoading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          removeTodo={removeTodo}
          isLoading={isLoading}
        />
      ))}

      {tempTodo && (
        <TempTodo tempTodo={tempTodo} />
      )}
    </section>
  );
};
