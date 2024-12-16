/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { deleteTodo, getTodos, addTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Error } from './components/ErrorMessage/ErrorMessage';

export enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [itemsLeft, setItemsLeft] = useState<number>(0);
  const [sortBy, setSortBy] = useState('all');
  const [errorMessage, setErrorMessage] = useState<string | null | boolean>(
    null,
  );
  const [deleteTodoId, setDeleteTodoId] = useState<number | null>(null);
  const [isLoadingChange, setIsLoadingChange] = useState(false);
  const [cleanCompleted, setCleanCompleted] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (query.trim() !== '') {
      setNewTask(query);
      setIsSubmiting(true);
    } else {
      setErrorMessage('Title should not be empty');
    }
  }

  function handleDeleteTodo(id: number) {
    setDeleteTodoId(id);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  function handleCleanCompleted() {
    setCleanCompleted(true);
  }

  useEffect(() => {
    if (inputRef.current || (errorMessage && inputRef.current)) {
      inputRef.current.focus();
    }
  }, [query, errorMessage, todos]);

  useEffect(() => {
    if (newTask.trim() !== '') {
      const todo: Omit<Todo, 'id'> = {
        userId: USER_ID,
        title: newTask.trim(),
        completed: false,
      };

      setTempTodo({ id: 0, ...todo });

      addTodo(todo)
        .then(receivedTodo => {
          setTempTodo(null);
          setQuery('');
          setTodos(currentTodos => [...currentTodos, receivedTodo]);
          setItemsLeft(currentItemsLeft => currentItemsLeft + 1);
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');

          if (inputRef.current) {
            inputRef.current.focus();
          }
        })
        .finally(() => {
          setTempTodo(null);
          setIsSubmiting(false);
          setNewTask('');
        });
    } else {
      setIsSubmiting(false);
    }
  }, [newTask]);

  useEffect(() => {
    if (errorMessage) {
      const timerEmpty = setTimeout(() => setErrorMessage(null), 3000);

      return () => clearTimeout(timerEmpty);
    }
  }, [errorMessage]);

  useEffect(() => {
    async function deleteTodoFromServer() {
      if (deleteTodoId !== null) {
        setIsLoadingChange(true);

        try {
          await deleteTodo(deleteTodoId).then(() => {
            const newTodos = todos.filter(todo => todo.id !== deleteTodoId);

            setTodos(newTodos);
          });
        } catch {
          setErrorMessage('Unable to delete a todo');
        } finally {
          setIsLoadingChange(false);

          const numbersOfItemsLeft: number = todos.filter(
            todo => !todo.completed,
          ).length;

          setItemsLeft(numbersOfItemsLeft);
        }
      }
    }

    const cleanup = deleteTodoFromServer();

    return () => {
      if (cleanup instanceof Function) {
        cleanup();
      }
    };
  }, [deleteTodoId, todos]);

  useEffect(() => {
    async function deleteTodoFromServer() {
      if (cleanCompleted) {
        setIsLoadingChange(true);
        setErrorMessage('');

        const completedTodos = todos.filter(todo => todo.completed);
        const deletionPromises = completedTodos.map(async todo => {
          try {
            await deleteTodo(todo.id);

            return todo.id;
          } catch (error) {
            setErrorMessage('Unable to delete a todo');

            /* eslint-disable-next-line no-console */
            console.error(`Error deleting todo ${todo.id}:`, error);

            return null;
          }
        });

        const resolvedDeletions = await Promise.all(deletionPromises);

        const successfulDeletions = resolvedDeletions.filter(
          id => id !== null,
        ) as number[];

        setTodos(prevTodos =>
          prevTodos.filter(todo => !successfulDeletions.includes(todo.id)),
        );

        const numbersOfItemsLeft: number = todos.filter(
          todo => !todo.completed,
        ).length;

        setItemsLeft(numbersOfItemsLeft);
      }

      setIsLoadingChange(false);
      setCleanCompleted(false);
    }

    deleteTodoFromServer();
  }, [cleanCompleted, todos]);

  useEffect(() => {
    async function getTodosFromServer() {
      try {
        const todosFromServer = await getTodos();

        const numbersOfItemsLeft: number = todosFromServer.filter(
          todo => !todo.completed,
        ).length;

        setItemsLeft(numbersOfItemsLeft);
        setErrorMessage(null);

        switch (sortBy) {
          case Filter.All:
            setTodos(todosFromServer);
            break;
          case Filter.Active:
            const sortedByActive: Todo[] = todosFromServer.filter(
              todo => !todo.completed,
            );

            setTodos(sortedByActive);
            break;
          case Filter.Completed:
            const sortedByCompleted: Todo[] = todosFromServer.filter(
              todo => todo.completed,
            );

            setTodos(sortedByCompleted);
            break;
        }
      } catch {
        setErrorMessage('Unable to load todos');
      }
    }

    getTodosFromServer();
  }, [sortBy]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          query={query}
          onInput={handleInput}
          onSubmit={handleSubmit}
          isSubmiting={isSubmiting}
          inputRef={inputRef}
        />

        <TodoList
          onDeleteTodo={handleDeleteTodo}
          todos={todos}
          isLoadingChange={isLoadingChange}
          deleteTodoId={deleteTodoId}
          cleanCompleted={cleanCompleted}
          tempTodo={tempTodo}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <Footer
            itemsLeft={itemsLeft}
            sortBy={sortBy}
            onSortBy={setSortBy}
            todos={todos}
            onCleanCompleted={handleCleanCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <Error errorMessage={errorMessage} onErrorMessage={setErrorMessage} />
    </div>
  );
};
