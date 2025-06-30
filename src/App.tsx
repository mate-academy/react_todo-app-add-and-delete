/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { useTodos } from './utils/useTodos';
import { ErrorNotif } from './components/ErrorNotif/ErrorNotif';
import { Footer } from './components/Footer/Footer';
import { Modal } from './components/Modal/Modal';
import { Loader } from './components/Loader/Loader';

export const App: React.FC = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const {
    todos,
    query,
    setQuery,
    onFormSubmit,
    onToggleAll,
    isLoading,
    selectedTodoId,
    handleToggleStatus,
    handleDelete,
    errorMessage,
    setErrorMessage,
    filterStatus,
    setFilterStatus,
    isAdding,
    tempTodo,
    deletingTodoId,
    setIsAdding,
    onFocusInput,
    handleClearCompleted,
  } = useTodos();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <Header
        todos={todos}
        query={query}
        setQuery={setQuery}
        onFormSubmit={onFormSubmit}
        onToggleAll={onToggleAll}
        isAdding={isAdding}
        inputRef={inputRef}
        onFocusInput={onFocusInput}
      />

      <TodoList
        todos={todos}
        tempTodo={tempTodo}
        isLoading={isLoading}
        selectedTodoId={selectedTodoId}
        deletingTodoId={deletingTodoId}
        handleToggleStatus={handleToggleStatus}
        handleDelete={id => {
          handleDelete(id);
          inputRef.current?.focus();
        }}
        query={query}
        filterStatus={filterStatus}
      />
      {todos.length > 0 && (
        <Footer
          todos={todos}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          handleClearCompleted={() => {
            handleClearCompleted();
            inputRef.current?.focus();
          }}
        />
      )}
      <ErrorNotif
        message={errorMessage}
        isVisible={!!errorMessage}
        onClose={() => setErrorMessage(null)}
      />
      {isAdding && (
        <Modal active={true} onClose={() => setIsAdding(false)}>
          <Loader />
        </Modal>
      )}
    </div>
  );
};
