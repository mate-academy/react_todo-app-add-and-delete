import { useContext } from 'react';
import { TodoContext } from '../providers/TodoProvider';
import { TodoItem } from './TodoItem';

export const TodoList = () => {
  const { filteredTodos } = useContext(TodoContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </section>
  );
};
