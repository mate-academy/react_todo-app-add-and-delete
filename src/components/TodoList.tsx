import React, { useContext } from 'react';
import { TodoContext } from './TodoContext';
import { TodoItem } from './TodoItem';

export const TodoList: React.FC = () => {
  const {
    todos,
    dispatch,
    handleError,
    deleteCandidates,
    handleClearCompleted,
    tmpTodo,
  } = useContext(TodoContext);

  return (
    <>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loading={deleteCandidates.includes(todo.id)}
          dispatch={dispatch}
          handleError={handleError}
          onDelete={handleClearCompleted}
        />
      ))}

      {tmpTodo && (
        <TodoItem
          key={tmpTodo.id}
          todo={tmpTodo}
          loading={true}
          dispatch={dispatch}
          handleError={handleError}
          onDelete={handleClearCompleted}
        />
      )}
    </>
  );
};
