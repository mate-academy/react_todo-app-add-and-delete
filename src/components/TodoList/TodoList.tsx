import { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface Props {
  todos: Todo[];
  deleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  isNewTodoLoading: boolean,
}

export const TodoList: React.FC<Props> = memo(({
  todos,
  deleteTodo,
  tempTodo,
  isNewTodoLoading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          deleteTodo={deleteTodo}
          key={todo.id}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          deleteTodo={deleteTodo}
          key={tempTodo?.id}
          isNewTodoLoading={isNewTodoLoading}
        />
      )}
    </section>
  );
});
