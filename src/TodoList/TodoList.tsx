/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { getFilteredTodos } from '../components/filteredTodos';
import { Todo } from '../types/Todo';
import { FilterTypes } from '../types/filterTypes';
import { TransitionGroup } from 'react-transition-group';
import { TodoItem } from '../TodoItem/TodoItem';

interface TodoListProps {
  todos: Todo[];
  filter: FilterTypes;
  deleteTodo: (todoId: number) => void;
  fakeTodo: Todo | null;
  isLoading: boolean;
}
export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  deleteTodo,
  fakeTodo,
  isLoading,
}) => {
  const filteredTodos = getFilteredTodos(todos, filter);

  return (
    <TransitionGroup>
      <section className="todoapp__main" data-cy="TodoList" key={0}>
        {filteredTodos.map(todo => (
          <TodoItem
            key={1}
            deleteTodo={deleteTodo}
            todo={todo}
            isLoading={isLoading}
          />
        ))}
        {fakeTodo && (
          <TodoItem
            key={0}
            deleteTodo={deleteTodo}
            todo={fakeTodo}
            isLoading={isLoading}
          />
        )}
      </section>
    </TransitionGroup>
  );
};
