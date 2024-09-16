import { useTodos } from '../../utils/TodoContext';
import { TodoItem } from '../TodoItem';
import { filterTodos } from '../../utils/filterTodos';

export const TodoList: React.FC = () => {
  const { todos, filter, tempTodo } = useTodos();

  const todosToDisplay = tempTodo ? [...todos, tempTodo] : todos;

  const visibleTodos = filterTodos(todosToDisplay, filter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </section>
  );
};
