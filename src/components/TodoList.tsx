import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => void,
  activeLoading: number[];
  isAdding: boolean;
  loader: number;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  activeLoading,
  loader,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoInfo
        key={todo.id}
        todo={todo}
        onDelete={onDelete}
        activeLoading={activeLoading.includes(todo.id)}
        loader={loader}
      />
    ))}
  </section>
);
