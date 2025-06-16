import { FC } from 'react';
import { getPreparedTodos } from '../../utils/getPreparedTodos';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';
import { TodoItem } from '../TodoItem/TodoItem';

interface TodoListProps {
  todos: Todo[];
  filter: FilterType;
  onDeleteTodo: (todoId: Todo['id']) => void;
  tempTodo: Todo | null;
  processingTodoIds: Todo['id'][];
}

export const TodoList: FC<TodoListProps> = ({
  todos,
  filter,
  onDeleteTodo,
  tempTodo,
  processingTodoIds,
}) => {
  const visibleTodos = getPreparedTodos<Todo>(todos, filter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          isLoading={processingTodoIds.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key="temp-todo"
          todo={tempTodo}
          onDeleteTodo={() => {}}
          isLoading={true}
        />
      )}
    </section>
  );
};
