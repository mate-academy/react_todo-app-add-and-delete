import React, { useContext } from 'react';
import { TodoContext } from '../Store/TodoContext';
import { TodoItem } from '../TodoItem/TodoItem';
import { Status } from '../../types/Status';

export const TodoList: React.FC = () => {
  const { todos, filterValue, tempTodo } = useContext(TodoContext);

  const filteredTodos = todos.filter(todo => {
    if (filterValue === Status.Active) {
      return !todo.completed;
    }

    if (filterValue === Status.Completed) {
      return todo.completed;
    }

    return true;
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} key={tempTodo.id} isLoading />}
    </section>
  );
};
