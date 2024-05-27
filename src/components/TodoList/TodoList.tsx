import React, { useContext } from 'react';
import { TodosContext } from '../TodosContext/TodosContext';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { filterTodos } from '../../utils/filterTodos';

export const TodoList: React.FC = () => {
  const { todos, filter } = useContext(TodosContext);

  const visibleTodos = filterTodos(todos, filter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map((todo: Todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </section>
  );
};
