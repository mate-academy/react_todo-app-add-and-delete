import React, { useContext } from 'react';

import './Main.scss';
import { TodosContext } from '../TodosContext';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

export const Main: React.FC = () => {
  const { todos, currentFilter } = useContext(TodosContext);

  const getVisibleTodos = (allTodos: Todo[], filter: Status) => {
    let shownTodos: Todo[] = [];

    switch (filter) {
      case Status.All:
        shownTodos = [...allTodos];
        break;

      case Status.Active:
        shownTodos = allTodos.filter(todo => !todo.completed);
        break;

      case Status.Completed:
        shownTodos = allTodos.filter(todo => todo.completed);
        break;

      default:
        throw new Error('Unknown filter!');
    }

    return shownTodos;
  };

  const visibleTodos = getVisibleTodos(todos, currentFilter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem key={todo.id} item={todo} />
      ))}
    </section>
  );
};
