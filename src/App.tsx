/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodos, deleteTodos, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './Components/TodoList/TodoList';
import { Footer } from './Components/Footer/Footer';
import { SortType } from './types/SortType';
/* eslint-disable-next-line max-len */
import { ErrorNotification } from './Components/ErrorNotification/ErrorNotification';
import { Header } from './Components/Header/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortType, setSortType] = useState<SortType>(SortType.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletePostsId, setDeletePostsId] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);

        throw new Error();
      });
  }, []);

  const filteredTodos = todos.filter(todo => {
    switch (sortType) {
      case SortType.Active: {
        return !todo.completed;
      }

      case SortType.Completed: {
        return todo.completed;
      }

      case SortType.all:
      default:
        return todo;
    }
  });

  function addDataToServer(listValue: string) {
    setErrorMessage('');
    const normalValue = listValue.trim();

    if (!normalValue) {
      setErrorMessage('Title should not be empty');

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return Promise.resolve(false);
    }

    const newTodoData = {
      title: listValue,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({
      id: 0,
      ...newTodoData,
    });

    return addTodos(newTodoData)
      .then(newTodo => {
        setTodos(currentTodo => [...currentTodo, newTodo]);

        return true;
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);

        return false;
      })
      .finally(() => {
        setTempTodo(null);
      });
  }

  function deleteDataFromServer(postId: number) {
    setErrorMessage('');
    setDeletePostsId(currentIds => [...currentIds, postId]);

    if (!postId) {
      setErrorMessage('Title should not be empty to delete');

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    deleteTodos(postId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== postId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setDeletePostsId(idOfPosts => idOfPosts.filter(id => id !== postId));
        inputRef.current?.focus();
      });
  }

  function deleteAllCompletedFromServer() {
    const completedId = todos
      .filter(todoFromArray => todoFromArray.completed)
      .map(todo => todo.id);

    for (const id of completedId) {
      deleteDataFromServer(id);
    }
  }

  const activeTodoCount = todos.filter(todo => !todo.completed).length;

  const hasCompletedTodos = todos.length > activeTodoCount;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          active={activeTodoCount}
          onChange={addDataToServer}
          inputRef={inputRef}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              filteredTodos={filteredTodos}
              tempTodo={tempTodo}
              deleteData={deleteDataFromServer}
              deleteId={deletePostsId}
            />

            <Footer
              activeTodosCount={activeTodoCount}
              currentSortType={sortType}
              onSortChange={setSortType}
              hasCompletedTodos={hasCompletedTodos}
              deletedAllCompleted={deleteAllCompletedFromServer}
            />
          </>
        )}
      </div>

      <ErrorNotification
        error={errorMessage}
        setError={catchError => setErrorMessage(catchError)}
      />
      {/*
          Unable to update a todo */}
    </div>
  );
};
