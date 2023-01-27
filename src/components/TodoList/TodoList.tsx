import { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[],
  onTodoDelete: (todoId: number) => void;
}

export const TodoList: React.FC<Props> = memo(({
  todos, onTodoDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onTodoDelete={onTodoDelete}
        />
      )))}
    </section>
  );
});
