import React, { useContext } from 'react';
import { TodosContext } from './TodosContext';
import { TodosItem } from './TodosItem';

export const TodosList: React.FC = () => {
  const {
    todosAfterFiltering,
    todoEditLoading,
  } = useContext(TodosContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosAfterFiltering
        .map((todo) => <TodosItem todo={todo} key={todo.id} />)}
      {todoEditLoading
        && <TodosItem todo={todoEditLoading} key={todoEditLoading.id} />}
    </section>
  );
};
