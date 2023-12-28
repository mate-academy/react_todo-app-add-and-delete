import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  setTodos: (value: Todo[]) => void;
  handleDeleteTodo: (value: number) => void;
  tempTodo: Todo | null;
};

export const List: React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  tempTodo,
  setTodos,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        handleDeleteTodo={handleDeleteTodo}
        todo={todo}
        key={todo.id}
        todos={todos}
        setTodos={setTodos}
      />
    ))}

    {tempTodo && (
      <TodoItem
        handleDeleteTodo={handleDeleteTodo}
        todo={tempTodo}
        key={tempTodo.id}
        todos={todos}
        setTodos={setTodos}
      />
    )}
  </section>
);
