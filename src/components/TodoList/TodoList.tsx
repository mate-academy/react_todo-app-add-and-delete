import React from 'react';

import { TodoItem } from '../TodoItem';
import { TodoLoadingItem } from '../TodoLoadingItem';

import { UseTodosContext } from '../../utils/TodosContext';

type Props = {
};

export const TodoList: React.FC<Props> = () => {
  const context = UseTodosContext();

  const {
    filteredTodos,
    tempTodo,
  } = context;

  return (
    <section data-cy="TodoList" className="todoapp__main">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
        />
      ))}

      {tempTodo && (
        <TodoLoadingItem key={tempTodo.id} tempTodo={tempTodo} />
      )}
    </section>
  );
};
