import React, { useContext } from 'react';

import { Filter } from '../../types/Filter';
import { StateContext } from '../Context/StateContext';
import { TodoItem } from './TodoItem';

export const TodoList: React.FC = () => {
  const { todos, tempTodo, filterType } = useContext(StateContext);

  const filtredTodos = todos.filter(todo => {
    switch (filterType) {
      case Filter.ACTIVE:
        return !todo.completed;

      case Filter.COMPLETED:
        return todo.completed;

      default:
        return todo;
    }
  });

  return (
    <>
      {
        filtredTodos.map(todo => (
          <TodoItem todo={todo} key={todo.id} />
        ))
      }

      {tempTodo && (
        <TodoItem todo={tempTodo} />
      )}
    </>
  );
};
