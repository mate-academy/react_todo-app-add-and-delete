import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  addedTodo: Todo | null,
  removeTodos(todo: Todo): void,
  isChanging: boolean,
};

export const TodoList: React.FC<Props> = ({
  todos,
  addedTodo,
  removeTodos,
  isChanging,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          isAdded={isChanging}
          removeTodos={removeTodos}
        />
      ))}
      {addedTodo && (
        <TodoItem
          todo={addedTodo}
          key={addedTodo.id}
          isAdded
          removeTodos={removeTodos}
        />
      )}
    </section>
  );
};
