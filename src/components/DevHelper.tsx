// remove before deploy !!!

import React from 'react';
import { Todo } from '../types/Todo';
type Props = {
  onSetFakeTodos: (todos: string) => void;
  onDeleteAllTodos: (id: number) => void;
  todos: Todo[];
};

const fakeTodos: string[] = [
  'delectus aut autem',
  'quis ut nam facilis et officia qui',
  'fugiat veniam minus',
  'et porro tempora',
  'laboriosam mollitia et enim ',
  ' quasi adipisci quia provident illum',
  'qui ullam ratione quibusdam  quia omnis',
  'illo expedita  quia in',
  'quo adipisci enim quam ut ab',
  'molestiae perspiciatis ipsa',
  'illo est ratione  quia maiores aut',
];

const DevHelper: React.FC<Props> = ({
  onSetFakeTodos,
  onDeleteAllTodos,
  todos,
}) => {
  const handleSetFakeTodos = () => {
    fakeTodos.forEach(todo => {
      onSetFakeTodos(todo);
    });
  };

  const handleDeleteAllTodos = () => {
    todos.forEach(todo => {
      onDeleteAllTodos(todo.id);
    });
  };

  return (
    <>
      <button
        onClick={handleSetFakeTodos}
        className="button is-primary"
        style={{ marginRight: '10px' }}
      >
        Insert fake todos
      </button>
      <button onClick={handleDeleteAllTodos} className="button is-danger">
        Delete all todos
      </button>
    </>
  );
};

export default DevHelper;
