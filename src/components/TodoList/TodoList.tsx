import React from 'react';
import { TodoInfo } from '../TodoInfo/TodoInfo';
import { useTodos } from '../context/TodosContext';
import { getPreparedTodos } from '../../utils/todos';

export const TodoList: React.FC = () => {
  const { todos, statusTodo, tempTodo } = useTodos();

  const visibleTodos = getPreparedTodos(todos, { statusTodo });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoInfo key={todo.id} todo={todo} isLoadingItem={false} />
      ))}
      {tempTodo && <TodoInfo todo={tempTodo} isLoadingItem={true} />}
    </section>
  );
};
