import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  filteredTodos: Todo[];
}
export const TodoList: React.FC<Props> = ({ filteredTodos }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </section>
  );
};
