import { useTodo } from '../providers/AppProvider';
import { TodoItem } from './TodoItem';

export const TodoList = () => {
  const { filteredTodos } = useTodo();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
        />
      ))}
    </section>
  );
};
