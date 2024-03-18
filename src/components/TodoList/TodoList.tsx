import { useTodos } from '../../context/TodosContext';
import { TempTodo } from '../TempTodo';
import { TodoItem } from '../TodoItem';

export const TodoList: React.FC = () => {
  const { todos, filterStatus } = useTodos();

  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case 'Active':
        return !todo.completed;
      case 'Completed':
        return todo.completed;
      case 'All':
      default:
        return todo;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
      <TempTodo />
    </section>
  );
};
