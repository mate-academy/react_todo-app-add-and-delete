import React, { useEffect, useRef, useState } from 'react';
import './styles/todoapp.scss';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, USER_ID } from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoErrorNotification } from './components/TodoErrorNotification';
import { Todo } from './types/Todo';
import { ErrorState } from './types/ErrorState';
import { Filter } from './enums/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [userInput, setUserInput] = useState('');
  const [filterType, setFilterType] = useState<Filter>(Filter.All);
  const [errorState, setErrorState] = useState<ErrorState>({
    message: '',
    isVisible: false,
  });
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosToDelete, setTodosToDelete] = useState<number[] | null>([]);
  const newTodoField = useRef<HTMLInputElement>(null);

  const getPreparedTodos = (type: Filter): Todo[] => {
    let preparedTodos = [...todos];

    if (type) {
      preparedTodos = preparedTodos.filter(todo => {
        switch (type) {
          case Filter.Active:
            return !todo.completed;
          case Filter.Completed:
            return todo.completed;
          default:
            return true;
        }
      });
    }

    return preparedTodos;
  };

  useEffect(() => {
    const loadTodos = async () => {
      setErrorState({
        message: '',
        isVisible: false,
      });

      try {
        const todosFromServer = await getTodos();

        setTodos(todosFromServer);
      } catch {
        setErrorState({
          message: 'Unable to load todos',
          isVisible: true,
        });
      }
    };

    loadTodos();
  }, []);

  const preparedTodos = getPreparedTodos(filterType);

  const hasTodos = todos.length > 0;

  const countActiveTodos = () => {
    let count = 0;

    todos.forEach(todo => {
      if (!todo.completed) {
        count++;
      }
    });

    return count;
  };

  const hasCompletedTodos = todos.some(todo => todo.completed);

  const handleDelete = async (todoId: number) => {
    await deleteTodo(todoId);

    setTodos(currentTodos => {
      return currentTodos.filter(currentTodo => currentTodo.id !== todoId);
    });
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const todosToRemoveIds = completedTodos.map(todo => todo.id);
    const todosToRemove = completedTodos.map(todo => deleteTodo(todo.id));

    setTodosToDelete(todosToRemoveIds);

    try {
      const deletionResult = await Promise.allSettled(todosToRemove);

      let hasError = false;

      const successfulIds = deletionResult
        .map((deletion, index) => {
          if (deletion.status === 'fulfilled') {
            return completedTodos[index].id;
          } else {
            hasError = true;

            return false;
          }
        })
        .filter(success => success !== false);

      setTodos(currentTodos =>
        currentTodos.filter(currentTodo => {
          return !successfulIds.includes(currentTodo.id);
        }),
      );

      if (hasError) {
        setErrorState({
          message: 'Unable to delete a todo',
          isVisible: true,
        });
      }
    } finally {
      setTodosToDelete(null);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          userInput={userInput}
          onFieldChange={setUserInput}
          onError={setErrorState}
          onCreateTodo={setTempTodo}
          onCreateTodoSuccess={setTodos}
          newTodoField={newTodoField}
        />

        <TodoList
          todos={preparedTodos}
          tempTodo={tempTodo}
          onTodoDelete={handleDelete}
          onError={setErrorState}
          todosToDelete={todosToDelete}
          newTodoField={newTodoField}
        />

        {/* Hide the footer if there are no todos */}
        {hasTodos && (
          <TodoFooter
            activeTodos={countActiveTodos()}
            filterType={filterType}
            onFilterTypeChange={setFilterType}
            hasCompletedTodos={hasCompletedTodos}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <TodoErrorNotification errorState={errorState} onHide={setErrorState} />
    </div>
  );
};
