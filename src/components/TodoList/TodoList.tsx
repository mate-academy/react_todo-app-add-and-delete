import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  currentTodos: Todo[];
  deleteTodo: (todo: Todo) => void;
  updateTodo: (todo: Todo) => void;
}

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  currentTodos,
  deleteTodo,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (

        <TodoItem
          todo={todo}
          currentTodos={currentTodos}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
        />
      ))}
    </section>
  );
});
