import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { TempTodo } from '../TempTodo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null,
  isloadingId: number;
  onDelete: (todoId: number) => void;
}

export const TodoList: FC<Props> = ({
  todos,
  tempTodo,
  isloadingId,
  onDelete: handleDeleteTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          isloadingId={isloadingId}
          onDelete={handleDeleteTodo}
        />
      ))}

      {tempTodo && (
        <TempTodo
          todo={tempTodo}
        />
      )}
    </section>
  );
};
