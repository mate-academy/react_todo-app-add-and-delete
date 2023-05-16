import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  onDelete: (todoId: number) => void;
}

export const TodoList: FC<Props> = ({
  todos,
  onDelete: handleDeleteTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={handleDeleteTodo}
        />
      ))}
    </section>
  );
};
