import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  currentTodo: Todo | null;
  deleteTodo: (todo: Todo) => void;
}

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  currentTodo,
  deleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (

        <TodoItem
          todo={todo}
          currentTodo={currentTodo}
          deleteTodo={deleteTodo}
        />
      ))}
    </section>
  );
});
