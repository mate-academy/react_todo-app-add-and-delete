import { Todo } from '../types/Todo';
import { TempTodo } from './TempTodo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  togleCheck: (id: number) => void;
  toDelete: (id: number) => void;
  showErrorNotification: (value: string) => void;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  togleCheck,
  toDelete,
  showErrorNotification,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem
          showErrorNotification={showErrorNotification}
          toDelete={toDelete}
          todo={todo}
          key={todo.id}
          togleCheck={togleCheck}
        />
      ))}
      {tempTodo && <TempTodo tempTodo={tempTodo} />}
    </section>
  );
};
