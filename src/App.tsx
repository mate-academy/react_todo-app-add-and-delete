/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';

import { UserWarning } from './UserWarning';

import * as todoServices from './api/todos';

import { ErrorMessage } from './types/ErrorMessage';
import { Todo } from './types/Todo';
import { FilterBy } from './types/FilterBy';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Error as ErrorCard } from './components/Error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.all);

  const [deletingCompleteTodos, setDeletingCompleteTodos] = useState(false);

  const [errorMessage, setErrorMessage] = useState<ErrorMessage>('');

  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    focusInput();

    todoServices
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally();
  }, []);

  const currentTodoList: Todo[] = todos.filter(item => {
    return (
      filterBy === FilterBy.all ||
      (filterBy === FilterBy.active && !item.completed) ||
      (filterBy === FilterBy.completed && item.completed)
    );
  });

  const handleDeleteTodo = (id: number, callback: CallableFunction) => {
    callback(true);
    todoServices
      .deleteTodo(id)
      .then(() => setTodos(todos.filter(todo => todo.id !== id)))
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        callback(false);
        focusInput();
      });
  };

  const handleDeleteAllCompletedTodos = async () => {
    setDeletingCompleteTodos(true);

    todoServices
      .deleteArrOfTodos(todos.filter(todo => todo.completed))
      .then(res => {
        const rejectedTodos = res
          .map((result, index) =>
            result.status === 'rejected'
              ? todos.filter(todo => todo.completed)[index]
              : null,
          )
          .filter(todo => todo !== null);

        setTodos(
          todos.filter(todo => !todo.completed || rejectedTodos.includes(todo)),
        );

        if (rejectedTodos.length > 0) {
          throw new Error('Some todos were not deleted');
        }
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setDeletingCompleteTodos(false);
        focusInput();
      });
  };

  const handleAddingTodo = () => {
    if (inputRef.current) {
      inputRef.current.disabled = true;

      if (inputText.trim() === '') {
        setErrorMessage('Title should not be empty');
        setTimeout(() => setErrorMessage(''), 3000);
        inputRef.current.disabled = false;
        focusInput();

        return;
      }

      setTempTodo({
        id: 0,
        userId: todoServices.USER_ID,
        title: inputText.trim(),
        completed: false,
      });

      todoServices
        .addPost(inputText.trim())
        .then(newTodo => {
          setTodos(list => [...list, newTodo]);
          setInputText('');
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
          setTimeout(() => setErrorMessage(''), 3000);
        })
        .finally(() => {
          if (inputRef.current) {
            inputRef.current.disabled = false;
          }

          setTempTodo(null);
          focusInput();
        });
    }
  };

  if (!todoServices.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputRef={inputRef}
          inputText={inputText}
          setInputText={setInputText}
          createFunc={handleAddingTodo}
        />

        <TodoList
          todos={currentTodoList}
          handleDeleteTodo={handleDeleteTodo}
          deletingCompleteTodos={deletingCompleteTodos}
          tempTodo={tempTodo}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            deleteCompletedTodos={handleDeleteAllCompletedTodos}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorCard
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
