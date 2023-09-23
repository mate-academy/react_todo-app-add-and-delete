import React, { useContext } from 'react';
import { Todo } from '../../types';
import { TodoItem } from '../TodoItem/TodoItem';
import { TodoContext } from '../../TodoContext';

type Props = {
  todos: Todo[];
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
}) => {
  const {
    tempTodo,
  } = useContext(TodoContext);

  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
        />
      )}
    </section>
  );
});
