import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todosFromServer: Todo[];
};

export const TodoList: React.FC<Props> = ({ todosFromServer }) => {
  return (
    <section className="todoapp__main">
      {/* This is a completed todo */}
      {todosFromServer.map(todo => <TodoInfo key={todo.id} todo={todo} />)}
    </section>
  );
};
