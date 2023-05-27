import { useState } from 'react';
import { TodoAppHeader } from './TodoAppComponent/TodoAppHeader';
import { TodoList } from './TodoAppComponent/TodoList';
import { useTodosContext } from '../utils/TodosContext';
import { Filters } from '../types/Filters';
import { TodoAppFooter } from './TodoAppComponent/TodoAppFooter';

export const TodoApp = () => {
  const [filtered, setFiltered] = useState<Filters>(Filters.All);
  const { todos } = useTodosContext();

  let filteredTodos = todos;

  if (filtered === 'Active') {
    filteredTodos = filteredTodos.filter(todo => !todo.completed);
  }

  if (filtered === 'Completed') {
    filteredTodos = filteredTodos.filter(todo => todo.completed);
  }

  const isFooter = todos.length > 0;

  return (
    <div className="todoapp__content">
      <TodoAppHeader />

      <TodoList filteredTodos={filteredTodos} />

      {isFooter && (
        <TodoAppFooter
          filtered={filtered}
          setFiltered={setFiltered}
        />
      )}
    </div>
  );
};
