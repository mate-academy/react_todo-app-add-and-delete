import { Todo } from '../types/Todo';
import { TodosFilter } from '../types/enums';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  filter: TodosFilter;
  handleDelete: (id: number) => void;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  filter,
  handleDelete,
  tempTodo,
}) => {
  const visibleTodos = todos.filter(todo => {
    if (filter === TodosFilter.Active) {
      return !todo.completed;
    }

    if (filter === TodosFilter.Completed) {
      return todo.completed;
    }

    return true;
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} onDelete={handleDelete} />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} onDelete={handleDelete} />}
    </section>
  );
};
