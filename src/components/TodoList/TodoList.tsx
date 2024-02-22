import { useTodos } from '../../Store';
import { getFilteredTodos } from '../../services/getFilteredTodos';
import { TodoItem } from '../TodoItem';

export const Todolist = () => {
  const { todos, filterStatus } = useTodos();

  const filteredTodos = getFilteredTodos(todos, filterStatus);

  return (
    <div className="todo-list" data-cy="todosList">
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};
