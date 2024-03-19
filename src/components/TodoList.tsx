import React, { useContext } from 'react';
import { TodoItem } from './TodoItem';
import { TodosContext } from './Todos-Context';
import { Todo } from '../types/Todo';

export const TodoList: React.FC = () => {
  const { newTodo }: { newTodo: Todo[] } = useContext(TodosContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {newTodo.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
    </section>
  );
};
