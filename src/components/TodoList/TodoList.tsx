import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

export interface TodoListProps {
  todos: Todo[],
  onDeleteTodo: (todoId: number) => void;
  tempTodo: Todo | null,
  deletingTodoIds: number[],
}

export const TodoList: FC<TodoListProps> = ({
  todos,
  onDeleteTodo,
  tempTodo,
  deletingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          isDeleting={deletingTodoIds.includes(todo.id)}

        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          isDeleting={deletingTodoIds.includes(tempTodo.id)}
        />
      )}
    </section>
  );
};
