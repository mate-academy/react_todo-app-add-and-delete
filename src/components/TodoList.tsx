import React, { useContext } from 'react';
import { TodoItem } from './TodoItem';
import { TodosContext } from '../context/TodosContext';

export const TodoList: React.FC = () => {
  const { todosToDisplay, tempTodo } = useContext(TodosContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosToDisplay.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};
