import { useEffect } from 'react';

import { useTodo } from './hooks/useTodo';

import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoErrorNotification } from './components/TodoErrorNotification';

export const App: React.FC = () => {
  const {
    todos,
    todosAmount,
    loadingTodoIds,
    tempTodo,
    activeTodosAmount,
    errorMessage,
    statusFilter,
    setStatusFilter,
    handleResetErrorMessage,
    handleLoadTodos,
    handleDeleteTodo,
    handleClearCompleted,
    isFocusedInput,
    newTodoTitle,
    handleTitleChange,
    isLoadingSubmit,
    handleSubmitForm,
  } = useTodo();

  useEffect(() => {
    handleResetErrorMessage();
    handleLoadTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todosAmount={todosAmount}
          activeTodosAmount={activeTodosAmount}
          isFocusedInput={isFocusedInput}
          newTodoTitle={newTodoTitle}
          onTitleChange={handleTitleChange}
          isLoadingSubmit={isLoadingSubmit}
          onSubmitForm={handleSubmitForm}
        />

        {!!todosAmount && (
          <>
            <TodoList
              todos={todos}
              loadingTodoIds={loadingTodoIds}
              tempTodo={tempTodo}
              statusFilter={statusFilter}
              onDeleteTodo={handleDeleteTodo}
            />

            <TodoFooter
              leftTodos={activeTodosAmount}
              statusFilter={statusFilter}
              onChangeStatusFilter={setStatusFilter}
              todosAmount={todosAmount}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <TodoErrorNotification
        errorMessage={errorMessage}
        onResetErrorMessage={handleResetErrorMessage}
      />
    </div>
  );
};
