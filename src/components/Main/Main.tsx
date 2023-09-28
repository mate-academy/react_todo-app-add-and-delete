import React, { useContext } from 'react';
import { TodosContext } from '../../TodosContext';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[]
};

export const Main: React.FC<Props> = ({ todos }) => {
  const { tempTodo } = useContext(TodosContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo todo={todo} key={todo.id} />

      ))}

      {tempTodo && (
        <TodoInfo todo={tempTodo} />
      )}
    </section>
  );
};
