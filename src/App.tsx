/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodos, deleteTodos, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/header';
import { TodoList } from './components/todoList';
import { Footer } from './components/footer';
import { Sort } from './types/Sort';
import { ErrorMassage } from './components/errorMassage';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [userTodos, setUserTodos] = useState<Todo[]>([]);
  const [errorMassage, setErrorMassage] = useState<ErrorMessage | null>(null);
  const [sortTodo, setsortTodo] = useState<Sort>('all');
  const [clearCompletedDisabled, setClearCompletedDisabled] = useState(true);
  const [isLoader, setIsLoader] = useState<string | number | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [updateAfterClearDelete, setUpdateAfterClearDelete] = useState(true);

  useEffect(() => {
    getTodos()
      .then(setUserTodos)
      .catch(() => {
        setErrorMassage(ErrorMessage.Load);
      });
  }, [updateAfterClearDelete]);

  useEffect(() => {
    const hasCompleted = userTodos.some(todo => todo.completed);

    setClearCompletedDisabled(!hasCompleted);
  }, [userTodos]);

  useEffect(() => {
    if (!errorMassage) {
      return;
    }

    const timer = setTimeout(() => setErrorMassage(null), 3000);

    return () => clearTimeout(timer);
  }, [errorMassage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function addToDo(title: string) {
    const userId = 3216;
    const completed = false;

    if (!title) {
      setErrorMassage(ErrorMessage.Empty);

      return Promise.resolve();
    }

    setIsLoader('temp');
    setTempTitle(title);

    return addTodos({ title, userId, completed })
      .then(newToDo => {
        setUserTodos(currentTodos => [...currentTodos, newToDo]);
      })
      .catch(error => {
        setErrorMassage(ErrorMessage.Add);
        throw error;
      })
      .finally(() => {
        setIsLoader(null);
      });
  }

  function deletePost(postId: number) {
    setIsLoader(postId);

    return deleteTodos(postId)
      .then(() => {
        setUserTodos(currentPosts => {
          return currentPosts.filter(post => post.id !== postId);
        });
      })
      .catch(error => {
        setErrorMassage(ErrorMessage.Delete);
        throw error;
      })
      .finally(() => setIsLoader(null));
  }

  function clearDelete(completedTodos: Todo[]) {
    const completedIds = completedTodos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    const deleteResults = completedIds.map(id =>
      deleteTodos(id)
        .then(() => ({ id, success: true }))
        .catch(() => {
          setErrorMassage(ErrorMessage.Delete);

          return { id, success: false };
        }),
    );

    Promise.all(deleteResults).then(results => {
      const successfulIds = results
        .filter(result => result.success)
        .map(result => result.id);

      setUserTodos(current =>
        current.filter(todo => !successfulIds.includes(todo.id))
      );

      setUpdateAfterClearDelete(prev => !prev);
    });
  }

  const sortedUserTodo = userTodos.filter(todo => {
    if (sortTodo === 'active') {
      return todo.completed === false;
    }

    if (sortTodo === 'completed') {
      return todo.completed === true;
    }

    return true;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header onSubmit={addToDo} />
        <TodoList
          sortedUserTodo={sortedUserTodo}
          onDelete={deletePost}
          isLoader={isLoader}
          tempTitle={tempTitle}
        />

        {userTodos.length > 0 && (
          <Footer
            sort={setsortTodo}
            userTodo={userTodos}
            visible={clearCompletedDisabled}
            clearDelete={clearDelete}
          />
        )}
      </div>
      <ErrorMassage errorMassage={errorMassage} massage={setErrorMassage} />
    </div>
  );
};
