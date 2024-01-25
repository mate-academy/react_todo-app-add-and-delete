import { useContext } from 'react';

import { TodoItem } from '../TodoItem';

import { Context } from '../../Context';

export const Main = () => {
  const { filteredTodos } = useContext(Context);

  return (
    <section className="todoapp__main" data-cy="TodoList">

      {filteredTodos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
    </section>
  );
};
