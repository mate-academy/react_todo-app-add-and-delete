import { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface TodoListProps {
  todos: Todo[]
  tempTodo: Todo | null;
  deleteTodo: (todoId: number) => Promise<unknown>
  delitingTodoIds: number[];
}

export const TodoList: React.FC<TodoListProps> = memo(({
  todos,
  tempTodo,
  deleteTodo,
  delitingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <>
        {todos.map(todo => (
          <TodoItem
            todo={todo}
            key={todo.id}
            deleteTodo={deleteTodo}
            isDeleting={delitingTodoIds.includes(todo.id)}
          />
        ))}

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            deleteTodo={deleteTodo}
            isDeleting={delitingTodoIds.includes(tempTodo.id)}
          />
        )}
      </>
    </section>
  );
});
