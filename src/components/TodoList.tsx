import { Todo } from '../types/Todo';
import { TodoComp } from './TodoComp';

type Props = {
  todos: Todo[];
  isLoading: boolean;
  onDeleteTodo: (id: number) => void;
  loadingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  isLoading,
  onDeleteTodo,
  loadingTodoIds,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoComp
        key={todo.id}
        todo={todo}
        isLoading={isLoading || loadingTodoIds.includes(todo.id)}
        onDeleteTodo={() => onDeleteTodo(todo.id)}
      />
    ))}
  </section>
);
