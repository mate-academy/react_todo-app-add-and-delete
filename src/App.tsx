import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, USER_ID, deleteTodo } from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { NewTodo } from './components/NewTodo';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';

type TodoWithTemp = Todo & { temp?: boolean };

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoWithTemp[]>([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState('all');

  const [disable, setDisable] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const [pendingList, setPendingList] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  function inputFocus() {
    inputRef.current?.focus();
  }

  useEffect(() => {
    if (!disable) {
      inputFocus();
    }
  }, [disable]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(er => {
        setError(true);
        setErrorMessage('Unable to load todos');

        throw er;
      });
  }, []);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') {
      return todo;
    } else if (filter === 'completed') {
      return todo.completed === true;
    } else if (filter === 'active') {
      return todo.completed === false;
    }
  });

  const todosForFooter = todos.filter(todo => !todo.temp);

  const handleAddTodo = (title: string) => {
    const normalizedTitle = title.trim();
    const tempId = Date.now();

    setError(false);
    setErrorMessage('');

    if (normalizedTitle === '') {
      setError(true);
      setErrorMessage('Title should not be empty');
      inputFocus();

      return;
    }

    const tempTodo: TodoWithTemp = {
      id: tempId,
      userId: USER_ID,
      completed: false,
      title: normalizedTitle,
      temp: true,
    };

    setDisable(true);
    setPendingList(prevList => [...prevList, tempId]);

    setTodos(prevTodos => [...prevTodos, tempTodo]);

    addTodo({
      userId: USER_ID,
      completed: false,
      title: normalizedTitle,
    })
      .then(createdTodo => {
        setTodos(prevTodos => {
          const withoutTemp = prevTodos.filter(item => item.id !== tempId);

          return [...withoutTemp, createdTodo];
        });
        setInputValue('');
      })
      .catch(() => {
        setTodos(prevTodos => prevTodos.filter(item => item.id !== tempId));
        setError(true);
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setDisable(false);
        setPendingList(prevList => prevList.filter(item => item !== tempId));
      });
  };

  const handleUpdate = (todoId: number) => {
    setTodos((prevState: Todo[]) => {
      return prevState.map((todo: Todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      );
    });

    setPendingList(prevList => prevList.filter(item => todoId !== item));
  };

  const handleDeleteTodo = (todoId: number) => {
    setPendingList(prevList => [...prevList, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevState => prevState.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError(true);
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setPendingList(prevList => prevList.filter(item => item !== todoId));
        inputFocus();
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}

          <NewTodo
            ref={inputRef}
            newTodo={handleAddTodo}
            disable={disable}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          toggleStatus={handleUpdate}
          deleteTodo={handleDeleteTodo}
          pendingList={pendingList}
        />

        {todosForFooter.length > 0 && (
          <Footer
            data={todosForFooter}
            setFilter={setFilter}
            clearCompeleted={() => {
              setTodos((prevState: Todo[]) =>
                prevState.map(item => {
                  if (item.completed === true) {
                    handleDeleteTodo(item.id);
                  }

                  return item;
                }),
              );
            }}
          />
        )}
      </div>

      <ErrorNotification
        status={error}
        statusMessage={errorMessage}
        setStatus={setError}
        setStatusMessage={setErrorMessage}
      />
    </div>
  );
};
