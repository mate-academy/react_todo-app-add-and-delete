/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import { TodoItem } from '../TodoItem';
import { TodosContext } from '../TodosContext';

type Props = {};

export const TodoList: React.FC<Props> = () => {
  const {
    filteredTodos,
    tempTodo,
  } = useContext(TodosContext);

  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        {filteredTodos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </section>

      {tempTodo && (
        <TodoItem
          key={tempTodo?.id}
          todo={tempTodo}
        />
      )}

    </>
  );
};
