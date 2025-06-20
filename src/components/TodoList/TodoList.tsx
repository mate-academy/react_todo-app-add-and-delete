/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoCard } from '../TodoCard/TodoCard';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({ todos, tempTodo, deleteTodo }) => {
  let tempTodoToRender = {
    id: 0,
    userId: 0,
    title: 'Unknown',
    completed: false,
    loading: false,
  };

  if (tempTodo) {
    tempTodoToRender = tempTodo;
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoCard key={todo.id} todo={todo} deleteTodo={deleteTodo} />
      ))}
      {Boolean(tempTodo) && (
        <TodoCard todo={tempTodoToRender} deleteTodo={deleteTodo} />
      )}
    </section>
  );
};
