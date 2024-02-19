import { useContext } from 'react';
import { StateContext } from './TodosContext';
import { TodoItem } from './TodoItem';

export const Main: React.FC = () => {
  const { todos, filterBy, tempTodo } = useContext(StateContext);

  const filterTodos = () => {
    switch (filterBy) {
      case 'all':
        return todos;

      case 'active':
        return todos.filter((todo) => !todo.completed);

      case 'completed':
        return todos.filter((todo) => todo.completed);

      default:
        return todos;
    }
  };

  const flteredTodos = filterTodos();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {flteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
        />
      )}
    </section>
  );
};
