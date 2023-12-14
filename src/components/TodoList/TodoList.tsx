import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  removeTodo: (id: number[]) => void,
  deletedTodo?: number | null,
  setTodos: (t: Todo[]) => void
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  deletedTodo,
  setTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todos={todos}
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          deletedTodo={deletedTodo}
          setTodos={setTodos}
        />
      ))}
    </section>
  );
};
