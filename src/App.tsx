/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todosService from './api/todos';
import { Todo } from './types/Todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/Todolist/Todolist';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/Error/Error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<string | null>(null);
  const [anyCompleted, setAnyCompleted] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleErrorMessage = (message: string) => {
    setErrorMessage(message);

    setTimeout(() => {
      handleErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    todosService
      .getTodos()
      .then(setTodos)
      .catch(error => {
        handleErrorMessage('Unable to load todos');
        throw error;
      });
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    setAnyCompleted(todos.some(todo => todo.completed));
  }, [todos]);

  useEffect(() => {
    if (!isDisabled) {
      inputRef.current?.focus();
    }
  }, [isDisabled]);

  const addTodo = ({ title, completed, userId }: Todo) => {
    setIsDisabled(true);

    if (!title.trim()) {
      handleErrorMessage('Title should not be empty');

      return;
    }

    setTempTodo({ id: 0, title, completed, userId });

    todosService
      .addTodo({ title, completed, userId })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setNewTodoTitle('');
      })
      .catch(() => handleErrorMessage('Unable to add a todo'))
      .finally(() => {
        setTempTodo(null);
        setIsDisabled(false);
        inputRef.current?.focus();
      });
  };

  const deleteTodo = (todoId: number) => {
    setProcessingIds(ids => [...ids, todoId]);
    setIsDisabled(true);
    todosService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
        setIsDisabled(false);
      })
      .catch(() => handleErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setProcessingIds(ids => ids.filter(id => id !== todoId));
        setIsDisabled(false);
        inputRef.current?.focus();
      });
  };

  const onTodoSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      handleErrorMessage('Title should not be empty');
      inputRef.current?.focus();

      return;
    }

    addTodo({
      title: newTodoTitle.trim(),
      completed: false,
      id: 0,
      userId: todosService.USER_ID,
    });
  };

  const filtredTodos = (filterQuery: string | null): Todo[] => {
    if (!filterQuery) {
      return todos;
    }

    if (filterQuery === 'completed') {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      return todos.filter(todo => todo.completed);
    }

    if (filterQuery === 'active') {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      return todos.filter(todo => !todo.completed);
    }

    return todos;
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      deleteTodo(todo.id);
    });
  };

  if (!todosService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onTodoSubmit={onTodoSubmit}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          isDisabled={isDisabled}
          inputRef={inputRef}
        />

        <TodoList
          filterBy={filterBy}
          filtredTodos={filtredTodos}
          deleteTodo={deleteTodo}
          processingIds={processingIds}
          tempTodo={tempTodo}
        />

        <Footer
          todos={todos}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          anyCompleted={anyCompleted}
          clearCompleted={clearCompleted}
        />
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification errorMessage={errorMessage} />
    </div>
  );
};
