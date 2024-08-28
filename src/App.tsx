/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deleteTodo, getTodos } from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoMain } from './components/TodoMain';
import { TodoFooter } from './components/TodoFooter';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Todo } from './types/Todo';
import { FilterOptions } from './types/FilterOptions';
import { ErrorMessage } from './types/ErrorMessage';

function filterTodos(todos: Todo[], option: FilterOptions) {
  switch (option) {
    case FilterOptions.FilterByAllButton:
      return todos;

    case FilterOptions.FilterByActiveTodos:
      return todos.filter(
        todo => Number(todo.completed) === FilterOptions.FilterByActiveTodos,
      );

    case FilterOptions.FilterByCompletedTodos:
      return todos.filter(
        todo => Number(todo.completed) === FilterOptions.FilterByCompletedTodos,
      );
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.NoErrors,
  );
  const [selectedOption, setSelectedOption] = useState<FilterOptions>(
    FilterOptions.FilterByAllButton,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDataInProceeding, setIsDataInProceeding] = useState(false);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  const handleSetTempTodo = (newTempTodo: Todo | null) => {
    setTempTodo(newTempTodo);
    if (newTempTodo) {
      setSelectedTodoId(newTempTodo.id);
    }
  };

  const handleFiltrationOption = (option: FilterOptions) => {
    setSelectedOption(option);
  };

  const handleNewTodo = (newTodo: Todo) => {
    setTodos(currentTodos => {
      return [...currentTodos, newTodo];
    });
  };

  const handleSetDataLoadingStatus = (status: boolean) => {
    setIsDataInProceeding(status);
  };

  const filteredTodos = filterTodos(todos, selectedOption);

  const handleToggleTodoStatus = (todoId: number) => {
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const handleError = (message: ErrorMessage) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(ErrorMessage.NoErrors);
    }, 3000);
  };

  const handleDeletionTodo = async (todoId: number) => {
    setIsDataInProceeding(true);
    setSelectedTodoId(todoId);
    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      handleError(ErrorMessage.OnDeletionTodo);
    } finally {
      setIsDataInProceeding(false);
      setSelectedTodoId(null);
    }
  };

  const handleDeleteCompletedTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed === true);

    setDeletingTodoIds(completedTodos.map(todo => todo.id));

    await Promise.allSettled(
      completedTodos.map(completedTodo => handleDeletionTodo(completedTodo.id)),
    );
  };

  useEffect(() => {
    console.log('isDataInProceeding after update:', isDataInProceeding); // for testing
  }, [isDataInProceeding]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        handleError(ErrorMessage.OnLoadingTodos);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          handleSetDataLoadingStatus={handleSetDataLoadingStatus}
          isDataInProceeding={isDataInProceeding}
          addTempTodo={handleSetTempTodo}
          updateTodoList={handleNewTodo}
          onError={handleError}
        />

        <TodoMain
          todos={filteredTodos}
          onDelete={handleDeletionTodo}
          selectedTodoId={selectedTodoId}
          todosIsDeleting={deletingTodoIds}
          tempTodo={tempTodo}
          isDataInProceeding={isDataInProceeding}
          toggleStatus={handleToggleTodoStatus}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            selectedOption={selectedOption}
            deleteCompletedTodos={handleDeleteCompletedTodos}
            selectOption={handleFiltrationOption}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        onClose={setErrorMessage}
      />
    </div>
  );
};
