import React from 'react';

import { useAppContext } from '../../context/AppContext';

import { FilterValues } from '../../types/FilterValues';
import { Todo } from '../../types/Todo';

import { TodoItem } from './TodoItem';

export const TodoList: React.FC = () => {
  const { todos, filter }: { todos: Todo[]; filter: FilterValues } =
    useAppContext();

  const filteredTodos = todos.filter(todo => {
    if (filter === FilterValues.Active) {
      return !todo.completed;
    }

    if (filter === FilterValues.Completed) {
      return todo.completed;
    }

    return true;
  });

  return (
    <section className="todoapp__todo-list" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
    </section>
  );
};
