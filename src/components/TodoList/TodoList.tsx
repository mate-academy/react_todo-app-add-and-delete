/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext } from 'react';
import './todoapp.scss';
import { TodoWithLoader } from '../../types/TodoWithLoader';
import { TodoItem } from './components/TodoItem/TodoItem';
import { todosContext } from '../../Store';
import { TempTodo } from './components/TempTodo';

type Props = {
  todos: TodoWithLoader[];
  updatedAt: Date;
};

export const TodoList: React.FC<Props> = React.memo(({ todos }) => {
  const { tempTodo } = useContext(todosContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.length > 0 &&
        todos.map(todo => {
          return <TodoItem todo={todo} key={todo.id} />;
        })}
      {tempTodo && <TempTodo tempTodo={tempTodo} />}
    </section>
  );
});
