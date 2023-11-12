import React, { useContext } from 'react';
import { TodosContext } from './TodosContext';
import { TodosItem } from './TodosItem';

export const TodosList: React.FC = () => {
  const {
    todosAfterFiltering,
    todoEditIsLoading,
  } = useContext(TodosContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosAfterFiltering
        .map((todo) => <TodosItem todo={todo} key={todo.id} />)}
      {todoEditIsLoading
        && <TodosItem todo={todoEditIsLoading} key={todoEditIsLoading.id} />}
    </section>
  );
};
