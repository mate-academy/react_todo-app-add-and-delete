import { Todo } from '../types/Todo';
import { TodoCard } from './TodoCard';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({ todos, onDelete }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoCard key={todo.id} todo={todo} onDelete={onDelete} />
      ))}
    </section>
  );
};
