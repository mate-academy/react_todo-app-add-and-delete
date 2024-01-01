import { FC } from 'react';
import cn from 'classnames';
import { SingleTodo } from './SingleTodo';
import { useAppContext } from '../context/AppContext';

export const TodoList: FC = () => {
  const { filteredTodos } = useAppContext();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {
        filteredTodos.map(todo => (
          <div
            key={todo.id}
            data-cy="Todo"
            className={cn('todo', {
              completed: todo.completed,
            })}
          >
            <SingleTodo todo={todo} />
          </div>
        ))
      }
    </section>
  );
};
