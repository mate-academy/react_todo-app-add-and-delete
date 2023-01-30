import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type TodoListProps = {
  todos: Todo[]
  tempTodo: Todo | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDeleteTodo: (todoId: number) => Promise<any>,
  delitingTodoIds: number[],
};

export const TodoList: React.FC<TodoListProps> = memo(({
  todos, tempTodo, onDeleteTodo, delitingTodoIds,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        todo={todo}
        key={todo.id}
        onDeleteTodo={onDeleteTodo}
        isDeliting={delitingTodoIds.includes(todo.id)}
      />
    ))}

    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        onDeleteTodo={onDeleteTodo}
        isDeliting={delitingTodoIds.includes(tempTodo.id)}
      />
    )}
  </section>
));
