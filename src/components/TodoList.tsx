import React, { useContext } from 'react';
import { TodoItem } from './TodoItem';
import { TodosContext } from '../context/TodosContext';
import { TempTodo } from './TempTodo';

export const TodoList: React.FC = () => {
  const { todosToDisplay, tempTodo } = useContext(TodosContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosToDisplay.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}

      {tempTodo && <TempTodo todo={tempTodo} />}
    </section>
  );
};
