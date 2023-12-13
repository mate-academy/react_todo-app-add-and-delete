import React, { useContext } from 'react';
import { GlobalContex } from '../TodoContext';
import { TodoItem } from './TodoItem';

export const TodoList: React.FC = () => {
  const { filteredTodos, tempTodo } = useContext(GlobalContex);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {!!filteredTodos && filteredTodos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} key={tempTodo.id} />}
    </section>
  );
};
