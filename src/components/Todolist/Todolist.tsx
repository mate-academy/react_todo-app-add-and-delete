import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  filteredTodos: Todo[] | null;
};

export const Todolist: React.FC<Props> = ({ filteredTodos }) => {
  return (
    <section className="todoapp__main">
      {filteredTodos?.map((todo) => (
        <TodoInfo todo={todo} key={todo.id} />
      ))}
    </section>
  );
};
