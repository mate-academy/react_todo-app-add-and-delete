/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useState } from 'react';
import { TodoManager } from './utils/TodoManager';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { AddTodoForm } from './components/AddTodoForm';
import { ErrorModal } from './components/ErrorModal';
import { Errors } from './types/Errors';
import { Loader } from './components/Loader';
import { TodoItem } from './components/TodoItem';
import './styles/todoapp.scss';
// import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const {
    todos,
    tempTodo,
    loading,
    todosToDisplay,
    //setTodos,
    errorMessage,
    setErrorMessage,
    isAdding,
    //setIsAdding,
    handleAddTodo,
    handleClearCompleted,
    handleDeleteTodo,
    isDeleting,
    //setIsDeleting,
    isToggling,
    //setIsToggling,
    isClearingCompleted,
    //setIsClearingCompleted,
    handleToggleAllTodos,
    onToggleTodo,
    filterBy,
    setFilterBy,
    //loading,
    //setloading,
    //filteredTodos,
  } = TodoManager();

  return (
    <div className="todoapp">
      <div className="todoapp__title">todo</div>
      <Header handleToggle={handleToggleAllTodos} />
      <AddTodoForm
        newTodoTitle={newTodoTitle}
        setNewTodoTitle={setNewTodoTitle}
        handleAddTodo={handleAddTodo}
        isAdding={isAdding}
      />
      {loading || isAdding ? (
        <Loader message="Loading your todos..." />
      ) : (
        <>
          <TodoList
            todos={todosToDisplay} // Pass the list of todos
            onToggleTodo={onToggleTodo} // Toggle logic
            onDeleteTodo={handleDeleteTodo} // Delete logic
            isDeleting={isDeleting} // Pass the deleting state
            isToggling={isToggling} // Pass the toggling state
          />
          <Footer
            todos={todos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            onClearCompleted={handleClearCompleted}
            isClearingCompleted={isClearingCompleted}
          />
        </>
      )}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={() => handleDeleteTodo(tempTodo.id)}
          isDeleting={isDeleting === tempTodo.id}
          loading={true}
          onToggle={() => Promise.resolve()}
          isToggling={isToggling === tempTodo.id}
        />
      )}
      {errorMessage !== Errors.DEFAULT && (
        <ErrorModal
          errorMessage={errorMessage}
          onClearError={() => setErrorMessage(Errors.DEFAULT)}
        />
      )}
    </div>
  );
};
