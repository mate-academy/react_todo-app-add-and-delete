import { useMemo } from 'react';
import { Filters } from '../../types/enums';
import { TodoItem } from '../TodoItem';
import { useAppContext } from '../AppProvider';

export const TodoList: React.FC = () => {
  const { todos, selectedFilter, tempTodo } = useAppContext();
  const filteredTodos = useMemo(
    () => todos.filter(({ completed }) => {
      switch (selectedFilter) {
        case Filters.All:
          return true;

        case Filters.Active:
          return !completed;

        case Filters.Completed:
          return completed;

        default:
          return true;
      }
    }),
    [todos, selectedFilter],
  );

  return (
    <section className="todoapp__main">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
        />
      )}
    </section>
  );
};
