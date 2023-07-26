import React, { useContext } from 'react';
import { TodosContext, UpdateTodosContext } from '../context/todosContext';

export const NewTodo:React.FC = () => {
  const {
    newTodoTitle,
    loading,
  } = useContext(TodosContext);

  const {
    onAddTodo,
    setNewTodoTitle,
  } = useContext(UpdateTodosContext);

  return (
    <form onSubmit={onAddTodo}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={event => setNewTodoTitle(event.target.value)}
        disabled={loading}
      />
    </form>
  );
};
