import React, {
  useContext, useEffect, useState, useMemo, useCallback,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import { NewTodoField } from './components/NewTodoField';
import { Todo } from './types/Todo';
import { Filters } from './types/Filters';
import { getTodos, createTodo, deleteTodoById } from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(Filters.All);

  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [temporaryNewTodo, setTemporaryNewTodo] = useState<Todo | null>(null);

  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);

  const showError = useCallback((message: string) => {
    setErrorMessage(message);

    setTimeout(() => setErrorMessage(''), 3000);
  }, []);

  const hideError = useCallback(() => {
    setErrorMessage('');
  }, []);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => showError('Cannot load todos'));
    }
  }, [user]);

  const activeTodosNumber = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (selectedStatus) {
        case Filters.Active:
          return !todo.completed;

        case Filters.Completed:
          return todo.completed;

        case Filters.All:
        default:
          return todo;
      }
    });
  }, [todos, selectedStatus]);

  const addTodo = useCallback((todoInfo: Omit<Todo, 'id'>) => {
    setIsAddingTodo(true);

    const temporaryTodo = {
      ...todoInfo,
      id: 0,
    };

    setTemporaryNewTodo(temporaryTodo);

    createTodo(todoInfo)
      .then((newTodo) => setTodos((prevTodos) => ([...prevTodos, newTodo])))
      .catch(() => showError('Unable to add a todo'))
      .finally(() => {
        setTemporaryNewTodo(null);
        setIsAddingTodo(false);
      });
  }, []);

  const deleteTodo = useCallback((todoId: number) => {
    setLoadingTodosIds((prevIds) => ([...prevIds, todoId]));

    deleteTodoById(todoId)
      .then(() => setTodos((prevTodos) => (prevTodos.filter(
        todo => todo.id !== todoId,
      ))))
      .catch(() => showError('Unable to delete a todo'))
      .finally(() => {
        setLoadingTodosIds((prevIds) => (prevIds.filter(
          todoIdToDelete => todoIdToDelete !== todoId,
        )));
      });
  }, []);

  const completedTodos = todos.filter(todo => todo.completed);

  const removeCompleted = () => (
    completedTodos.forEach(todo => deleteTodo(todo.id))
  );

  const shouldRenederTodos = temporaryNewTodo || todos.length > 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodoField
          onAddTodo={addTodo}
          showError={showError}
          isAddingTodo={isAddingTodo}
        />

        {shouldRenederTodos && (
          <>
            <TodoList
              todos={filteredTodos}
              temporaryNewTodo={temporaryNewTodo}
              showError={showError}
              onDeleteTodo={deleteTodo}
              loadingTodosIds={loadingTodosIds}
            />

            <Filter
              activeTodosNumber={activeTodosNumber}
              removeCompleted={removeCompleted}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              completedTodos={completedTodos}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          message={errorMessage}
          hideMessage={hideError}
        />
      )}
    </div>
  );
};
