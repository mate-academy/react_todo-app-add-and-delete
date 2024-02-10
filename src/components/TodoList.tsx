/* eslint-disable import/no-cycle */

import { useContext } from 'react';
import { TodoItem } from './TodoItem';
import { Filter } from '../types/enum';
import { TodoContext } from '../TodoContext';
import { TodoContextProps } from '../types/interfaces';

export const TodoList = () => {
  const { state, tempTodo } = useContext(TodoContext) as TodoContextProps;

  const filteredTodos = state.todos.filter(todo => {
    switch (state.filter) {
      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      case Filter.All:
        return true;

      default:
        return true;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};
