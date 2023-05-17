import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
}

export const TodoList: React.FC<Props> = ({ todos, tempTodo, onDelete }) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={onDelete}
        />
      )}
    </section>
  );
};
