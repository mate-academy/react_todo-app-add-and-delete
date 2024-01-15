import { memo } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[],
  tempTodo: Todo | null,
  deleteTodo: (id: number) => void,
  deleteTodoId: number | null,
}

export const TodoList: React.FC<Props> = memo(({
  todos, tempTodo, deleteTodo, deleteTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(({ title, completed, id }) => (
        <TodoItem
          title={title}
          completed={completed}
          id={id}
          key={id}
          deleteTodo={deleteTodo}
          isLoading={deleteTodoId === id}
        />
      ))}
      {tempTodo && (
        <TodoItem
          title={tempTodo.title}
          completed={false}
          id={tempTodo.id}
          deleteTodo={deleteTodo}
          isLoading
        />
      )}
    </section>
  );
});
