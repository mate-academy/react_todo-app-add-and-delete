import React from 'react';
import { Todo } from '../../types/Todo';
import { Nav } from './Nav';

type Porps = {
  todos: Todo[]
  deleteCompletedTodos: () => void;
};

export const Footer: React.FC<Porps> = ({ todos, deleteCompletedTodos }) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {todos.length}
        {' '}
        items left
      </span>

      <Nav />

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={()=> deleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
