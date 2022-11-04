import React from 'react';
import { Todo } from '../types/Todo';
import { TodoCard } from './TodoCard';

type Props = {
  todos: Todo[];
  setTodosList: React.Dispatch<React.SetStateAction<Todo[]>>,
  setDeleteError: React.Dispatch<React.SetStateAction<boolean>>,
  deleteAll: boolean,
};

export const TodosList: React.FC<Props> = ({
  todos,
  setTodosList,
  setDeleteError,
  deleteAll,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo: Todo) => (
        <TodoCard
          todo={todo}
          setTodosList={setTodosList}
          setDeleteError={setDeleteError}
          deleteAll={deleteAll}
          key={todo.id}
        />
      ))}
    </section>
  );
};
