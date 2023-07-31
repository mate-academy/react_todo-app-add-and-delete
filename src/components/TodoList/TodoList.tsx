import { useContext } from 'react';
import { TodoContext } from '../TodoContext/TodoContext';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

export const TodoList: React.FC = () => {
  const { todos } = useContext(TodoContext);

  return (
    <section className="todoapp__main">
      {todos.map((todo: Todo) => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
    </section>
  );
};
