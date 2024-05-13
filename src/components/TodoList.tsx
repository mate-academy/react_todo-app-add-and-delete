import React, { useContext } from 'react';
import { TodoContext } from './TodoContext';
import { TodoItem } from './TodoItem';
import { TEMP_USER_ID } from './Header';

export const TodoList: React.FC = () => {
  const {
    todos,
    dispatch,
    handleError,
    deleteCandidates,
    handleDeleteCandidates,
  } = useContext(TodoContext);

  return (
    <>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loading={
            todo.id === TEMP_USER_ID || deleteCandidates.includes(todo.id)
          }
          dispatch={dispatch}
          handleError={handleError}
          onDelete={handleDeleteCandidates}
        />
      ))}
    </>
  );
};
