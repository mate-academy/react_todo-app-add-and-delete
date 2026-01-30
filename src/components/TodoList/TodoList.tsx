import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todo';

type Props = {
  todos: Todo[];
  toggleStatus: (value: number) => void;
  deleteTodo: (value: number) => void;
  pendingList: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  toggleStatus,
  deleteTodo,
  pendingList,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          toggleStatus={toggleStatus}
          deleteTodo={deleteTodo}
          pendingList={pendingList}
        />
      ))}
    </section>
  );
};
