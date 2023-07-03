import { FC } from 'react';
import { TodoInfo } from '../TodoInfo';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  onRemoveTodo: (todoId: number) => void;
  loadingTodo: number[];
  tempTodo: Todo | null;
}

export const TodoList: FC<Props> = ({
  todos,
  onRemoveTodo,
  loadingTodo,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          onRemoveTodo={onRemoveTodo}
          loadingTodo={loadingTodo}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          loadingTodo={loadingTodo}
          onRemoveTodo={onRemoveTodo}
        />
      )}
    </section>
  );
};
