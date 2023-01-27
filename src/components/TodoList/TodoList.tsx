import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  todoIdForDeleting: number[];
  deleteTodo: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = memo((props) => {
  const {
    todos,
    todoIdForDeleting,
    deleteTodo,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isDeleting={todoIdForDeleting.includes(todo.id)}
          deleteTodo={deleteTodo}
        />
      ))}
    </section>
  );
});
