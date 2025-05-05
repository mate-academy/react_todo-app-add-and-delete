import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, postTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import TodoList from './components/TodoList/TodoList';
import { FilterType } from './types/FilterType';

type TempTodo = {
  id: number;
  title: string;
  completed: boolean;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [todoInput, setTodoInput] = useState<string>('');
  const [disableInput, setDisableInput] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<TempTodo | null>(null);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const fetchedTodos = await getTodos();

        setTodos(fetchedTodos);
      } catch (error) {
        setErrorMessage('Unable to load todos');
      }
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const activeTodos = todos.filter(todo => !todo.completed).length;

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      case FilterType.All:
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodos = async (e: React.FormEvent) => {
    e.preventDefault();

    if (disableInput) {
      return;
    }

    const trimmedTitle = todoInput.trim();

    if (trimmedTitle === '') {
      setErrorMessage('Title should not be empty');
      setTimeout(() => inputRef.current?.focus(), 0);

      return;
    }

    setDisableInput(true);

    setTempTodo({ id: 0, title: trimmedTitle, completed: false });

    try {
      const newTodo = await postTodos({
        title: trimmedTitle,
        completed: false,
      });

      setTodos(prev => [...prev, newTodo]);
      setTodoInput('');
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setDisableInput(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleDeleteTodo = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    const idCurrent = Number(target.getAttribute('value'));

    setLoadingTodoId(idCurrent);

    try {
      await deleteTodo(idCurrent);

      const updatedTodos = todos.filter(todo => todo.id !== idCurrent);

      setTodos(updatedTodos);

      setTimeout(() => inputRef.current?.focus(), 0);
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setLoadingTodoId(null);
    }
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    try {
      const results = await Promise.allSettled(
        completedTodos.map(todo => deleteTodo(Number(todo.id))),
      );

      const errors = results
        .map((result, index) =>
          result.status === 'rejected' ? completedTodos[index] : null,
        )
        .filter(todo => todo !== null);

      const remainingTodos = todos.filter(
        todo => !todo.completed || errors.includes(todo),
      );

      setTodos(remainingTodos);

      if (errors.length > 0) {
        setErrorMessage('Unable to delete a todo');
      }

      setTimeout(() => inputRef.current?.focus(), 0);
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todoInput={todoInput}
          disableInput={disableInput}
          setTodoInput={setTodoInput}
          addTodos={addTodos}
          inputRef={inputRef}
          todos={todos}
        />

        {todos.length > 0 && (
          <TodoList
            filteredTodos={filteredTodos}
            tempTodo={tempTodo}
            handleDeleteTodo={handleDeleteTodo}
            loadingTodoId={loadingTodoId}
          />
        )}
        {todos.length > 0 && (
          <Footer
            activeTodos={activeTodos}
            filter={filter}
            setFilter={setFilter}
            todos={todos}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
