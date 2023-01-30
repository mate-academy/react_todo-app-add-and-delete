import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[],
  tempTodo: Todo | null,
  onDeleteTodo: (todoId: number) => Promise<any>,
}

export const TodoList: React.FC<Props> = memo((props) => {
  const {
    todos,
    tempTodo,
    onDeleteTodo,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
        />
      )}
    </section>
  );
});
