import React, { useContext } from 'react';
import { TodoItem } from './TodoItem';
import { TodosContext } from './Todos-Context';
import { Loader } from './Loader';

export const TodoList: React.FC = () => {
  const { newTodo, tempTodo } = useContext(TodosContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {newTodo.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
      {tempTodo && <Loader />}
    </section>
  );
};
