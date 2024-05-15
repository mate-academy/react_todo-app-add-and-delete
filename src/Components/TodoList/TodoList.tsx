import { useContext } from 'react';
import { TodoInfo } from '../TodoInfo.tsx/TodoInfo';
import { TodoContext } from '../../Context/TodoContext';

export const TodoList: React.FC = () => {
  const { visibleTodos, tempTodo } = useContext(TodoContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        return <TodoInfo key={todo.id} todo={todo} />;
      })}
      {tempTodo && <TodoInfo key={tempTodo.id} todo={tempTodo} />}
    </section>
  );
};
