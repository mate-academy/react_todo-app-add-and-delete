import { TodoStatus } from '../../types/TodoStatus';
import { Todo } from '../../types/Todo';
import { useTodosState } from '../../contexts/TodosContext';
import { TodoItem } from '../TodoItem';

const FILTERS = {
  all: 'all',
  completed: 'completed',
  active: 'active',
};

type Props = {
  filterBy: TodoStatus;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  filterBy,
  tempTodo,
}) => {
  const [todos] = useTodosState();

  const prepareTodos = () => {
    switch (filterBy) {
      case FILTERS.active:
        return todos.filter(todo => !todo.completed);
      case FILTERS.completed:
        return todos.filter(todo => todo.completed);
      case FILTERS.all:
      default:
        return todos;
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {prepareTodos().map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={tempTodo.id}
        />
      )}
    </section>
  );
};
