/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../types/Todo';
import { TodoCard } from './TodoCard';

type Props = {
  todos: Todo[];
  deleteTodo: (todoId: number) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  USER_ID: number;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  setTodos,
  USER_ID,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => (
        <TodoCard
          key={todo.id}
          todo={todo}
          todos={todos}
          deleteTodo={deleteTodo}
          setTodos={setTodos}
          USER_ID={USER_ID}
        />
      ))}
    </section>
  );
};
