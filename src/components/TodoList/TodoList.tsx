import React, { useContext } from 'react';
import { TodoItem } from '../TodoItem';
import { Status } from '../../types/Status';
import { TodoContext } from '../../context/TodoContext';

export const TodoList: React.FC = () => {
  const { todos, filterValue } = useContext(TodoContext);

  const filteredTodos = todos.filter(todo => {
    if (filterValue === Status.Active) {
      return todo.completed === false;
    }

    if (filterValue === Status.Completed) {
      return todo.completed === true;
    }

    return true;
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
    </section>
  );
};
