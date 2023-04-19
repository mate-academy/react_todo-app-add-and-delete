import React from 'react';
import { AddNewTodo } from './AddNewTodo';
import { ToggleAll } from './ToggleAll';

type HeaderProps = {
  // define props here
  allTodosCompleted: boolean,
  handleTaggleAll: () => Promise<void>,
  fetchTodos: () => Promise<void>,
  showErrorNotification: (error: string) => void,
  setIsAddingNewTodo: React.Dispatch<React.SetStateAction<boolean>>,
  isAddingNewTodo: boolean,
};

export const Header: React.FC<HeaderProps> = ({
  allTodosCompleted,
  handleTaggleAll,
  fetchTodos,
  showErrorNotification,
  setIsAddingNewTodo,
  isAddingNewTodo,
}) => {
  return (
    <header className="todoapp__header">
      <ToggleAll
        allTodosCompleted={allTodosCompleted}
        handleTaggleAll={handleTaggleAll}
      />

      {/* Add a todo on form submit */}
      <AddNewTodo
        showErrorNotification={showErrorNotification}
        setIsAddingNewTodo={setIsAddingNewTodo}
        isAddingNewTodo={isAddingNewTodo}
        fetchTodos={fetchTodos}
      />
    </header>
  );
};
