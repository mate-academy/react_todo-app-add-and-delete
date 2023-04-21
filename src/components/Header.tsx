import React from 'react';
import { AddNewTodo } from './AddNewTodo';
import { ToggleAll } from './ToggleAll';
import { Todo } from '../types/Todo';

type HeaderProps = {
  // define props here
  allTodosCompleted: boolean,
  handleTaggleAll: () => Promise<void>,
  showErrorNotification: (error: string) => void,
  setIsAddingNewTodo: React.Dispatch<React.SetStateAction<boolean>>,
  isAddingNewTodo: boolean,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  todos: Todo[],
  setLoadingActiveTodoId: React.Dispatch<React.SetStateAction<number[]>>,
};

export const Header: React.FC<HeaderProps> = ({
  allTodosCompleted,
  handleTaggleAll,
  showErrorNotification,
  setIsAddingNewTodo,
  isAddingNewTodo,
  setTodos,
  setLoading,
  todos,
  setLoadingActiveTodoId,
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
        setTodos={setTodos}
        setLoading={setLoading}
        todos={todos}
        setLoadingActiveTodoId={setLoadingActiveTodoId}
      />
    </header>
  );
};
