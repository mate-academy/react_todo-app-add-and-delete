import React, { useContext } from 'react';
import { TodoContext } from '../services/TodoContext';
import { Filter } from '../types/Filter';
import { TodoInfo } from './TodoInfo';

export const TodoList: React.FC = () => {
  const { todos, filter, tempTodo } = useContext(TodoContext);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        {filteredTodos.map(todo => (
          <TodoInfo key={todo.id} todo={todo} />
        ))}
      </section>
      {tempTodo !== null && (
        <TodoInfo key={tempTodo.id} todo={tempTodo} isLoading={true} />
      )}
    </>
  );
};
