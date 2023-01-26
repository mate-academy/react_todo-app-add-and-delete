import { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null,
  isDeleting: boolean,
  todoForDeleltingIds: number[],
  onTodoDelete: (todoId: number) => Promise<void>,
};

export const TodoList: React.FC<Props> = memo((props) => {
  const {
    todos,
    tempTodo,
    isDeleting,
    todoForDeleltingIds,
    onTodoDelete,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          isDeleting={isDeleting}
          todoForDeleltingIds={todoForDeleltingIds}
          onTodoDelete={onTodoDelete}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          temporary
        />
      )}
    </section>
  );
});
