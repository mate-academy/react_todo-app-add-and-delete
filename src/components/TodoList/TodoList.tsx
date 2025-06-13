import React from 'react';

import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  filterField: Filter;
  handleDeleteTodo: (todoId: Todo['id']) => void;
  processingTodoIds: Todo['id'][];
};

const getFilteredTodos = (todos: Todo[], filterField: Filter) => {
  let filteredTodos = [...todos];

  switch (filterField) {
    case Filter.Active:
      filteredTodos = filteredTodos.filter(todo => !todo.completed);
      break;

    case Filter.Completed:
      filteredTodos = filteredTodos.filter(todo => todo.completed);
      break;
  }

  return filteredTodos;
};

export const TodoList: React.FC<Props> = ({
  todos,
  filterField,
  handleDeleteTodo,
  processingTodoIds,
}) => {
  const filteredTodos = getFilteredTodos(todos, filterField);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            handleDeleteTodo={handleDeleteTodo}
            isLoading={processingTodoIds.includes(todo.id)}
          />
        );
      })}
    </section>
  );
};
