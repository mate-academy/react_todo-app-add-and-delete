import React, { useMemo } from 'react';
import { TodoList } from '../TodoList/TodoList';
import { Todo } from '../../types/Todo';
import { Status } from '../../enums/Status';

type Props = {
  todos: Todo[],
  filter: Status,
  temp: Todo | null,
  updateLoading: React.Dispatch<React.SetStateAction<boolean>>,
  updateError: React.Dispatch<React.SetStateAction<string>>,
};

export const Main: React.FC<Props> = ({
  todos,
  filter,
  temp,
  updateLoading,
  updateError,
}) => {
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Status.Active:
        return todos.filter(todo => !todo.completed);
      case Status.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  return (
    <section className="todoapp__main">
      <TodoList
        todos={filteredTodos}
        temp={temp}
        updateLoading={updateLoading}
        updateError={updateError}
      />
    </section>
  );
};
