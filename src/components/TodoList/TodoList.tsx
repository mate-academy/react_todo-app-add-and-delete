import { FC } from 'react';
import { LoadTodos, Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  loadTodos: LoadTodos;
};

export const TodoList: FC<Props> = ({
  visibleTodos,
  tempTodo,
  loadTodos,
}) => {
  return (
    <section className="todoapp__main">
      {
        visibleTodos.map((todo) => (
          <TodoItem
            todo={todo}
            key={todo.id}
            loadTodos={loadTodos}
          />
        ))
      }
      {
        tempTodo && (
          <TodoItem
            todo={tempTodo}
            key="tempTodo"
            loadTodos={loadTodos}
          />
        )
      }
    </section>
  );
};
