import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null,
  loader: boolean;
  onDelete: (todoId: number) => void;
}

export const TodoList: FC<Props> = ({
  todos,
  tempTodo,
  loader,
  onDelete: handleDeleteTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          loader={loader}
          onDelete={handleDeleteTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          loader={loader}
          onDelete={() => {}}
        />
      )}
    </section>
  );
};
