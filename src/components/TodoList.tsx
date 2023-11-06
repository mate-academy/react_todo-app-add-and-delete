import { useContext } from 'react';
import { TodoContext } from '../TodoContext';
import { TodoItem } from './TodoItem';

export const TodoList: React.FC = () => {
  const { visibleTodos, tempTodo } = useContext(TodoContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
      {tempTodo && (
        <TodoItem todo={tempTodo} />
      )}
    </section>
  );
};
