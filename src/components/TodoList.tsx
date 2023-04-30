import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({ todos, onDelete }) => (
  <div>
    {todos.map((todo: Todo) => (
      <TodoItem key={todo.id} todo={todo} onDelete={() => onDelete(todo.id)} />
    ))}
  </div>
);
