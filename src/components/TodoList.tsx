import React from 'react';
import { Todo } from '../types/Todo';
import '../styles/todo.scss';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[]
  handleDelete: (id : number) => void;
};

export const TodoList: React.FC<Props> = ({ todos, handleDelete }) => {
  return (
    <>
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          handleDelete={handleDelete}
        />

      ))}
    </>
  );
};
