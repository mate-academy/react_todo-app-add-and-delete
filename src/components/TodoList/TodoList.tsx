import React, { useContext } from 'react';
import { TodoContext } from '../../context/TodoContext';
import { TodoInfo } from '../TodoInfo/TodoInfo';
import TempTodo from '../TempTodo/TempTodo';

export const TodoList: React.FC = () => {
  const { visibleTodos, tempTodo } = useContext(TodoContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoInfo todo={todo} key={todo.id} />
      ))}
      {tempTodo && <TempTodo todo={tempTodo} />}
    </section>
  );
};
