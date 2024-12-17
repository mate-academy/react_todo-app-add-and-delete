import React, { useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';

interface Errors {
  messages: string[];
}

export const App: React.FC = () => {
  const [isClearCompletedDesabled, setIsClearCompletedDesabled] =
    useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errors, setErrors] = useState<Errors>({ messages: [] });
  const [input, setInput] = useState('');
  const [isLoadingTodos, setIsLoadingTodos] = useState(true);
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(false);
  const [errorTimeout, setErrorTimeout] = useState<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isInputDisabled, isDeleteDisabled]);

  const updateClearCompletedState = useCallback((todosList: Todo[]) => {
    setIsClearCompletedDesabled(!todosList.some(todo => todo.completed));
  }, []);

  const showError = useCallback(
    (message: string) => {
      setErrors(prev => ({
        messages: [...new Set([...prev.messages, message])],
      }));
      setNotificationVisible(true);

      if (errorTimeout) {
        clearTimeout(errorTimeout);
      }

      const timeout = setTimeout(() => {
        setErrors({ messages: [] });
        setNotificationVisible(false);
      }, 3000);

      setErrorTimeout(timeout);
    },
    [errorTimeout],
  );

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (input.trim().length === 0) {
      showError('Title should not be empty');

      return;
    }

    setIsInputDisabled(true);

    const temporaryTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: input.trim(),
      completed: false,
    };

    setTempTodo(temporaryTodo);

    try {
      const newTodo = await addTodo({
        userId: USER_ID,
        title: input.trim(),
        completed: false,
      });

      setTodos(prevTodos => {
        const updatedTodos = [...prevTodos, newTodo];

        updateClearCompletedState(updatedTodos);

        return updatedTodos;
      });
      setTempTodo(null);
      setInput('');
    } catch (error) {
      showError('Unable to add a todo');
      setTempTodo(null);
    } finally {
      setIsInputDisabled(false);
      inputRef.current?.focus();
    }
  };

  const handleDeleteCompletedTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    const failedDeletions: Todo[] = [];

    try {
      await Promise.all(
        completedTodos.map(async todo => {
          try {
            await deleteTodo(todo.id);
          } catch {
            failedDeletions.push(todo);
            showError('Unable to delete a todo');
          }
        }),
      );

      setTodos(prevTodos => {
        const updatedTodos = prevTodos.filter(
          todo => !todo.completed || failedDeletions.includes(todo),
        );

        updateClearCompletedState(updatedTodos);

        return updatedTodos;
      });
    } catch (error) {
      showError('Unable to delete a todo');
    } finally {
      setIsDeleteDisabled(false);
      inputRef.current?.focus();
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setIsDeleteDisabled(true);

    try {
      await deleteTodo(id);
      setTodos(prevTodos => {
        const updatedTodos = prevTodos.filter(todo => todo.id !== id);

        updateClearCompletedState(updatedTodos);

        return updatedTodos;
      });
    } catch (error) {
      showError('Unable to delete a todo');
    } finally {
      setIsDeleteDisabled(false);
      inputRef.current?.focus();
    }
  };

  // const handleToggleAllTodos = async () => {
  //   const allCompleted = todos.every(todo => todo.completed);

  //   try {
  //     const updatedTodos = await Promise.all(
  //       todos.map(async todo => {
  //         const updatedTodo = { ...todo, completed: !allCompleted };

  //         await editTodo(updatedTodo);

  //         return updatedTodo;
  //       }),
  //     );

  //     setTodos(updatedTodos);
  //   } catch (error) {
  //     showError('Unable to update todos');
  //   }
  // };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todosData = await getTodos();

        setTodos(todosData);
        updateClearCompletedState(todosData);
      } catch (error) {
        showError('Unable to load todos');
      } finally {
        setIsLoadingTodos(false);
      }
    };

    fetchTodos();
  }, [showError, updateClearCompletedState]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all"
            data-cy="ToggleAllButton"
            // onClick={handleToggleAllTodos}
          />
          <form onSubmit={handleFormSubmit}>
            <input
              data-cy="NewTodoField"
              ref={inputRef}
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isInputDisabled}
            />
          </form>
        </header>

        {tempTodo ? (
          <div className="todoapp__todo-item">
            <span className="todoapp__todo-title">{tempTodo.title}</span>
            <span className="loader"></span>
          </div>
        ) : (
          ''
        )}

        {!isLoadingTodos && todos.length ? (
          <TodoList
            clearDisabled={isClearCompletedDesabled}
            tempTodo={tempTodo}
            isDeleteDisabled={isDeleteDisabled}
            deleteTodo={handleDeleteTodo}
            todos={todos}
            deleteCompleted={handleDeleteCompletedTodos}
          />
        ) : (
          ''
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light',
          'has-text-weight-normal',
          {
            hidden: !isNotificationVisible,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            setNotificationVisible(false);
            setErrors({ messages: [] });
            if (errorTimeout) {
              clearTimeout(errorTimeout);
            }
          }}
        />
        {errors.messages.map((error, index) => (
          <div key={index}>{error}</div>
        ))}
      </div>
    </div>
  );
};

// Unable to load todos
// <br />
// Title should not be empty
// <br />
// Unable to add a todo
// <br />
// Unable to delete a todo
// <br />
// Unable to update a todo
