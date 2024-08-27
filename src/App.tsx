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

function filterTodos(todos: Todo[], option: FilterOptions) {
  if (option === -1) {
    return todos;
  }

  return todos.filter(todo => todo.completed === option);
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedOption, setSelectedOption] = useState<FilterOptions>(-1);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDataInProceeding, setIsDataInProceeding] = useState(false);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  const handleSetTempTodo = (newTempTodo: Todo | null) => {
    setTempTodo(newTempTodo);
    setIsDataInProceeding(true);
  };

  const handleFiltrationOption = (option: FilterOptions) => {
    setSelectedOption(option);
  };

  const handleNewTodo = (newTodo: Todo) => {
    setTodos(currentTodos => {
      return [...currentTodos, newTodo];
    });
  };

  const filteredTodos = filterTodos(todos, selectedOption);

  const handleToggleTodoStatus = (todoId: number) => {
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const handleDeletionTodo = async (todoId: number) => {
    setIsDataInProceeding(true);
    setSelectedTodoId(todoId);
    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      handleError('Unable to delete a todo');
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
        handleError('Unable to load todos');
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
