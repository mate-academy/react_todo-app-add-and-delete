import { useTodoContext } from '../context/TodoContext';
import { TodoItem } from './TodoItem';
import { Filter } from '../types/Filter';

export const TodoList: React.FC = () => {
  const { todos, filter } = useTodoContext();

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case Filter.ACTIVE:
        return !todo.completed;
      case Filter.COMPLETED:
        return todo.completed;
      case Filter.ALL:
      default:
        return true;
    }
  });

  return (
    <section className="todoapp__main">
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </section>
  );
};
