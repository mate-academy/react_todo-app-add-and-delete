import React from 'react';
import { Todo } from '../../types/Todo';
import { MainList } from './MainList';

interface Props {
  todos: Todo[];
  deleteToDo: (userId: number) => void;
  tempTodo: Todo | null;
}

export const MainTodo: React.FC<Props> = ({ todos, deleteToDo, tempTodo }) => {
  return (
    <section className="todoapp__main">
      {tempTodo !== null ? (
        <MainList todo={tempTodo} key={tempTodo.id} deleteToDo={deleteToDo} />
      ) : (
        todos.map((todo) => (
          <MainList todo={todo} key={todo.id} deleteToDo={deleteToDo} />
        ))
      )}
    </section>
  );
};
