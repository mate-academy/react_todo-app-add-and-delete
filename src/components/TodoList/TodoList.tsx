import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  todoIdForDeleting: number[];
  removeTodo: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = memo((props) => {
  const {
    todos,
    todoIdForDeleting,
    removeTodo,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isDeleting={todoIdForDeleting.includes(todo.id)}
          removeTodo={removeTodo}
        />
      ))}
    </section>
  );
});
