import { FC } from 'react';
import cn from 'classnames';
import { SingleTodo } from './SingleTodo';
import { useAppContext } from '../context/AppContext';

export const TodoList: FC = () => {
  const { visibleTodos, tempTodo } = useAppContext();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {
        visibleTodos.map(todo => (
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
      {
        tempTodo && (
          <div
            key={tempTodo.id}
            data-cy="Todo"
            className="todo"
          >
            <SingleTodo todo={tempTodo} />
          </div>
        )
      }
    </section>
  );
};
