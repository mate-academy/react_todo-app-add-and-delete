import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  todoIDsForDeleting: number[];
  onRemoving: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = memo((props) => {
  const {
    todos, todoIDsForDeleting, onRemoving,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          isDeleting={todoIDsForDeleting.includes(todo.id)}
          onRemoving={onRemoving}
        />
      ))}
    </section>
  );
});
