/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import type { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { deleteTodo } from './api/todos';
import { updateTodo } from './api/todos';
import { addTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { FormAdd } from './components/FormAdd';
import { FooterBottom } from './components/FooterBottom';
import { ErrorMessages } from './types/ErrorMessages';
import { FilterBy } from './types/ErrorMessages';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]); // рендер тудушок
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>('all'); //.. для фільтрації стан
  const [tempTodo, setTempTodo] = useState<Todo | null>(null); //.. для тимчасового тодо
  const [isAdding, setIsAdding] = useState(false); //.. стан для прапорця дізейбл
  const [shouldFocusInput, setShouldFocusInput] = useState(false); // .. прапорець для фокусу на інпуті

  useEffect(() => {
    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.Load);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const hasTodos = todos.length > 0;

  let visibleTodos = todos;

  if (filterBy === 'active') {
    visibleTodos = visibleTodos.filter(todo => todo.completed === false);
  }

  if (filterBy === 'completed') {
    visibleTodos = visibleTodos.filter(todo => todo.completed === true);
  }

  const onClose = () => {
    setErrorMessage('');
  };

  const handleDelete = (id: number) => {
    setLoadingIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
        setShouldFocusInput(true);
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.Delete);

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(todoId => todoId !== id));
      });
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setLoadingIds(completedTodos.map(todo => todo.id));

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    const successfulIds = completedTodos
      .filter((_, index) => results[index].status === 'fulfilled')
      .map(todo => todo.id);

    const hasError = results.some(result => result.status === 'rejected');

    setTodos(currentTodos =>
      currentTodos.filter(todo => !successfulIds.includes(todo.id)),
    );

    if (hasError) {
      setErrorMessage(ErrorMessages.Delete);

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    setShouldFocusInput(true);
    setLoadingIds([]);
  };

  const handleAddTodo = async (title: string): Promise<boolean> => {
    const normalizedTitle = title.trim();

    if (isAdding === true) {
      return false;
    }

    if (!normalizedTitle) {
      setErrorMessage(ErrorMessages.Title);

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return false;
    }

    const tempTodoElement = {
      id: 0,
      title: normalizedTitle,
      userId: USER_ID,
      completed: false,
    };

    setIsAdding(true);
    setTempTodo(tempTodoElement);

    try {
      const newTodo = await addTodo(normalizedTitle);

      setTodos(prev => [...prev, newTodo]);

      return true;
    } catch {
      setErrorMessage(ErrorMessages.Add);

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return false;
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const toggleTodo = (todo: Todo) => {
    // Крок 1: Додаємо ID в список (лоадер вмикається)
    setLoadingIds(prev => [...prev, todo.id]);

    updateTodo(todo.id, { completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(current =>
          current.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.Update);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        // Крок 2: Видаляємо ID зі списку (лоадер вимикається)
        // Ми залишаємо всі ID, крім того, що щойно закінчив роботу
        setLoadingIds(prev => prev.filter(id => id !== todo.id));
      });
  };

  const updateTodoItem = (id: number, title: string) => {
    updateTodo(id, { title }).then(updatedTodo => {
      setTodos(currentTodos =>
        currentTodos.map(todo => {
          if (todo.id !== id) {
            return todo;
          }

          return {
            ...todo,
            ...updatedTodo,
          };
        }),
      );
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {/* form-input */}
        <FormAdd
          handleAddTodo={handleAddTodo}
          allCompleted={allCompleted}
          hasTodos={hasTodos}
          isAdding={isAdding}
          shouldFocusInput={shouldFocusInput}
          setShouldFocusInput={setShouldFocusInput}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              handleDelete={handleDelete}
              toggleTodo={toggleTodo}
              loadingIds={loadingIds}
              updateTodoItem={updateTodoItem}
              tempTodo={tempTodo}
            />

            <FooterBottom
              todos={todos}
              clearCompleted={clearCompleted}
              setFilterBy={setFilterBy}
              filterBy={filterBy}
            />
          </>
        )}
        {/* ErrorNotification */}
        <ErrorNotification errorMessage={errorMessage} onClose={onClose} />
      </div>
    </div>
  );
};
