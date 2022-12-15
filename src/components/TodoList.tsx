import React from 'react';
import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';
import { Notifications } from '../types/Notifications';

interface Props {
  todos: Todo[],
  setNotification: (value: Notifications) => void,
}

export const TodoList:React.FC<Props> = ({
  todos,
  setNotification,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map((todo: Todo) => (
      <TodoInfo
        todo={todo}
        setNotification={setNotification}
        key={todo.id}
      />
    ))}
  </section>
);
