import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  removeTodo: (id: number) => void;
  tempTodo: Todo | null;
  loadingTodos: number[];
};

export const Main: FC<Props> = ({
  todos,
  removeTodo,
  tempTodo,
  loadingTodos,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          loadingTodos={loadingTodos}
          removeTodo={removeTodo}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          loadingTodos={loadingTodos}
          removeTodo={removeTodo}
        />
      )}
    </section>
  );
};
