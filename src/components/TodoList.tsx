import { useContext } from 'react';
import { StatesContext } from '../context/Store';
import { TodoItem } from './TodoItem';

export const TodoList: React.FC = () => {
  const { todos, filter, tempTodo } = useContext(StatesContext);
  const filteredTodos = todos.filter(t => {
    switch (filter) {
      case 'all':
        return t;
      case 'active':
        return !t.completed;
      case 'completed':
        return t.completed;
      default:
        return t;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => {
        return <TodoItem todo={todo} key={todo.id} />;
      })}
      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};
