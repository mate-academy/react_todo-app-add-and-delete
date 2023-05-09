import { FC, useContext } from 'react';

import { Todo } from '../../types';
import { TodoItem } from '../TodoItem';
import { TodosContext } from '../TodosContext/TodosContext';

interface Props {
  visibleTodos: Todo[]
}

export const TodoList: FC<Props> = ({ visibleTodos }) => {
  const { newTodo, todoLoading } = useContext(TodosContext);

  return (
    <section className="todoapp__main">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
        />

      ))}
      {newTodo && (
        <TodoItem
          todo={newTodo}
          todoLoading={todoLoading}
        />
      )}
    </section>
  );
};
