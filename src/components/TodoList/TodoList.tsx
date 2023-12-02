import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { useAppState } from '../AppState/AppState';

export const TodoList: React.FC = () => {
  const {
    todosFilter,
  } = useAppState();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosFilter && todosFilter.map(
        (todo: Todo) => <TodoItem key={todo.id} todo={todo} />,
      )}
    </section>
  );
};
