import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
// import { MyContext, MyContextData } from '../context/myContext';

interface Props {
  data: Todo[];
}

export const TodoList: React.FC<Props> = ({ data }) => {
  //  const {tempTodo} = useContext(MyContext) as MyContextData;
  //  const isTempTodo = !!tempTodo

  const updatedData: Todo[] = data;

  //  console.log(tempTodo)
  //  if (isTempTodo !== null) {
  //   updatedData = data.push(tempTodo as Todo);
  //  }
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {updatedData.map(item => (
        <TodoItem todo={item} key={item.id} />
      ))}
      {/* {isTempTodo &&(<TodoItem todo={tempTodo} loading={true} key={tempTodo.id} />)} */}
    </section>
  );
};
