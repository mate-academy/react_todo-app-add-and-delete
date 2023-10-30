import React, { useContext } from 'react';

import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { StateContext } from '../states/Global';
import { TempTodo } from './TempTodo';

interface Props {
  todos: Todo[],
}

export const TodoList: React.FC<Props> = React.memo(({ todos }) => {
  const { tempTodo } = useContext(StateContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {
        todos.map(todo => (
          <TodoItem todo={todo} key={todo.id} />
        ))
      }
      {tempTodo && (
        <TempTodo todo={tempTodo} />
      )}
    </section>
  );
});
