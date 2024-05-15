import { FC, useContext } from 'react';

import { TodoItem } from '..';
import { AppContext } from '../../wrappers/AppProvider';

export const TodoList: FC = () => {
  const { filteredTodo } = useContext(AppContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodo.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
    </section>
  );
};
