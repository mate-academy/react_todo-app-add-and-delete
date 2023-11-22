import React, { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { StateContext } from '../../Context/Store';

type Props = {
  todos: Todo[];
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  const { tempTodo } = useContext(StateContext);

  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => (
          <TodoItem todo={todo} key={todo.id} />
        ))}
        {tempTodo && (<TodoItem todo={tempTodo} key={tempTodo.id} />)}
      </section>
    </>
  );
};
