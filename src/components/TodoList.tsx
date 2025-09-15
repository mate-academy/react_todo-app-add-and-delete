import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  toggleTodo: (todo: Todo) => void;
  isLoading: boolean;
};

export const TodoList: React.FC<Props> = ({ todos, toggleTodo, isLoading }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TodoItem todos={todos} toggleTodo={toggleTodo} isLoading={isLoading} />
    </section>
  );
};
