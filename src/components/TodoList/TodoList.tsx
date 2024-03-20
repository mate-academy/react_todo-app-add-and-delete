import TodoItem from '../TodoItem/TodoItem';

import TempTodo from '../TempTodo';

import { useTodos } from '../../hooks/useTodos';
import { Filter } from '../../types';

const TodoList: React.FC = () => {
  const { todos, filter } = useTodos();

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}

      <TempTodo />
    </section>
  );
};

export default TodoList;
