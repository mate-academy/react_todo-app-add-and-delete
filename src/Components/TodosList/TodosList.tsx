import React, { useContext } from 'react';

import { TodosContext } from '../../Context';
import { TodoItem } from '../TodoItem';

import getFilteredTodos from '../../helpers/getTodos';

export const TodosList: React.FC = () => {
  const { todos, filter } = useContext(TodosContext);

  if (!todos.length) {
    return null;
  }

  const filteredTodos = getFilteredTodos(todos, filter);

  return (
    <section className="todoapp__main">
      {filteredTodos.map(todo => <TodoItem todo={todo} key={todo.id} />)}
    </section>
  );
};
