import React, { useContext } from 'react';
import { TodoListItem } from '../TodoListItem/TodoListItem';
import { TodosContext } from '../../contexts/TodosContext';

export const TodoList: React.FC = () => {
  const { tempTodo, visibleTodos } = useContext(TodosContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoListItem todo={todo} key={todo.id} />
      ))}
      {tempTodo && (
        <TodoListItem todo={tempTodo} key={tempTodo.id} />
      )}
    </section>
  );
};
