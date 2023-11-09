import React, { useContext } from 'react';

import { GlobalContext } from '../../providers/GlobalContext';
import { TodoItem } from '../TodoItem';

export const TodoList: React.FC = () => {
  const {
    // USER_ID,
    // todos,
    // setTodos,
    // filter,
    // setFilter,
    filteredTodos,
    // setFilteredTodos,
    // error,
    // setError,
    // inputRef,
    tempTodo,
    // setTempTodo,
  } = useContext(GlobalContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};
