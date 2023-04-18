import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  handleRemoveTodo: (id: number) => void;
  activeIds: Array<number>;
};

export const TodoList: FC<Props> = ({
  visibleTodos,
  tempTodo,
  handleRemoveTodo,
  activeIds,
}) => {
  return (
    <section className="todoapp__main">
      {
        visibleTodos.map((todo) => (
          <TodoItem
            todo={todo}
            key={todo.id}
            handleRemoveTodo={handleRemoveTodo}
            activeIds={activeIds}
          />
        ))
      }
      {
        tempTodo && (
          <TodoItem
            todo={tempTodo}
            key="tempTodo"
            handleRemoveTodo={handleRemoveTodo}
            activeIds={activeIds}
          />
        )
      }
    </section>
  );
};
