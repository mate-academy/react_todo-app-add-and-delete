import React, { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { MyContext, MyContextData } from '../context/myContext';

interface Props {
  data: Todo[];
}

export const TodoList: React.FC<Props> = ({ data }) => {
  const { tempTodo } = useContext(MyContext) as MyContextData;
  const isTempTodo = !!tempTodo;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {data.map(item => (
        <TodoItem todo={item} key={item.id} />
      ))}
      {isTempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};
