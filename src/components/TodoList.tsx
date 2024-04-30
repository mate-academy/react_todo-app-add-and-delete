import React from 'react';
import { useAppContext } from '../context/Context';
import { TodoItem } from './TodoItem';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export const TodoList: React.FC = () => {
  const {
    state: { todos, filter, tempTodo },
  } = useAppContext();

  const filterFunctions: { [key: string]: (todo: Todo) => void } = {
    [Filter.Active]: todo => !todo.completed,
    [Filter.Completed]: todo => todo.completed,
    [Filter.All]: () => true,
  };

  const filteredTodos = todos.filter(todo => filterFunctions[filter](todo));

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todoData={todo} />
      ))}
      {tempTodo && <TodoItem todoData={tempTodo} isLoading={true} />}
    </section>
  );
};
