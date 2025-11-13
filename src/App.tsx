/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem/todoItem';
import { Error } from './components/Error/errorMessage';
import { FilterEnum, Footer } from './components/Footer/footer';
import { Header } from './components/Header/header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filter, setFilter] = useState<FilterEnum>(FilterEnum.all);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filteredTodos, setFilteredTodos] = useState<Todo[] | null>(todos);
  const [value, setValue] = useState('');
  const [countOfTodos, setCountOfTodos] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [waitingDelete, setWaitingDelete] = useState(false);
  const [todoWaitDeleteId, setTodoWaitDeleteId] = useState<number | null>(null);

  const setError = (text: string, duration = 3000): void => {
    setErrorMessage(text);
    setTimeout(() => setErrorMessage(null), duration);
  };

  useEffect(() => {
    async function fetchTodos() {
      try {
        const todosFromServer = await getTodos();

        setTodos(todosFromServer);
      } catch (error) {
        setError('Unable to load todos');
        throw error;
      }
    }

    fetchTodos();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (filter && todos) {
      switch (filter) {
        case FilterEnum.all:
          setFilteredTodos(todos);
          break;
        case FilterEnum.active:
          setFilteredTodos(todos.filter(todo => !todo.completed));
          break;
        case FilterEnum.completed:
          setFilteredTodos(todos.filter(todo => todo.completed));
          break;
        default:
          setFilteredTodos(todos);
          break;
      }
    }
  }, [filter, todos]);

  useEffect(() => {
    if (!todos) {
      return;
    }

    setCountOfTodos(todos.filter(todo => !todo.completed).length | 0);
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function toggleTodoCompleted(todoId: number) {
    setTodos(prevTodos => {
      if (!prevTodos) {
        return prevTodos;
      }

      setIsLoaded(true);
      setTimeout(() => {
        setIsLoaded(false);
      }, 100);

      return prevTodos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      );
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();

    if (trimmed.length <= 0) {
      setError('Title should not be empty');

      return;
    }

    setTempTodo({ id: 0, title: trimmed, completed: false, userId: USER_ID });
    setWaiting(true);
    setIsProcessed(true);
    async function postTodo() {
      try {
        const todoFromServer = await createTodo(trimmed);

        setIsProcessed(false);
        setTodos(prev => (prev ? [...prev, todoFromServer] : [todoFromServer]));
        setValue('');
      } catch (error) {
        setError('Unable to add a todo');
      } finally {
        setTempTodo(null);
        setWaiting(false);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    }

    postTodo();
  }

  function handleDelete(todoId: number) {
    async function rmTodo() {
      setWaitingDelete(true);
      setTodoWaitDeleteId(todoId);
      try {
        await deleteTodo(todoId);
        setTodos(prev =>
          prev ? prev.filter(todo => todo.id !== todoId) : prev,
        );
      } catch (error) {
        setErrorMessage('Unable to delete a todo');
      } finally {
        setWaitingDelete(false);
        setTodoWaitDeleteId(null);
      }
    }

    rmTodo();
  }

  async function handleClearCompleted() {
    if (!todos) {
      return;
    }

    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    setTodos(
      prev =>
        prev?.filter(todo => {
          if (!todo.completed) {
            return true;
          }

          const index = completedTodos.findIndex(t => t.id === todo.id);

          return results[index].status === 'rejected';
        }) || [],
    );

    if (results.some(r => r.status === 'rejected')) {
      setError('Unable to delete a todo');
    }

    inputRef.current?.focus();
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleSubmit={handleSubmit}
          value={value}
          setValue={setValue}
          waiting={waiting}
          inputRef={inputRef}
          countOfTodos={countOfTodos}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos?.map((todo: Todo) => {
            return (
              <TodoItem
                key={todo.id}
                todo={todo}
                isLoaded={isLoaded}
                toggleTodoCompleted={toggleTodoCompleted}
                isProcessed={isProcessed}
                handleDelete={handleDelete}
                waitingDelete={waitingDelete}
                todoWaitDeleteId={todoWaitDeleteId}
                inputRef={inputRef}
              />
            );
          })}
          {tempTodo && (
            <TodoItem
              key={tempTodo.id}
              todo={tempTodo}
              isLoaded={true}
              toggleTodoCompleted={toggleTodoCompleted}
              isProcessed={isProcessed}
              handleDelete={handleDelete}
              waitingDelete={waitingDelete}
              todoWaitDeleteId={todoWaitDeleteId}
              inputRef={inputRef}
            />
          )}
        </section>

        {todos && todos.length > 0 && (
          <Footer
            countOfTodos={countOfTodos}
            filter={filter}
            setFilter={setFilter}
            handleClearCompleted={handleClearCompleted}
            completedTodos={todos ? todos.filter(todo => todo.completed) : []}
          />
        )}
      </div>

      <Error errorMsg={errorMessage} />
    </div>
  );
};
