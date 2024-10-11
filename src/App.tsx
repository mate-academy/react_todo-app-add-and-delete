/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [titleNewTodo, setTitleNewTodo] = useState<string>('');
  const [loader, setLoader] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const deleteError = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        deleteError();
      });
  }, []);

  useEffect(() => {
    if (loader === false) {
      inputRef.current?.focus();
    }
  }, [loader]);

  const addTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
    if (title.trim() === '') {
      setErrorMessage('Title should not be empty');
      deleteError();

      return;
    }

    setLoader(true);

    const newTempTodo: Todo = { id: 0, title, completed, userId };

    setTempTodo(newTempTodo);

    todoService
      .createTodo({ title, completed, userId })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
        setTitleNewTodo('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTempTodo(null);
        deleteError();
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const deleteTodo = (todoId: number) => {
    setLoadingIds(prevState => [...prevState, todoId]);

    setLoader(true);

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        deleteError();
      })
      .finally(() => {
        setLoader(false);
        setLoadingIds(prevState => prevState.filter(id => id != todoId));
      });
  };

  const deleteCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedTodoIds = completedTodos.map(todo => todo.id);

    setLoader(true);

    setLoadingIds(prevState => [...prevState, ...completedTodoIds]);

    Promise.allSettled(
      completedTodos.map(todo => todoService.deleteTodo(todo.id)),
    )
      .then(results => {
        const successfullyDeletedIds = results
          .filter(result => result.status === 'fulfilled')
          .map((_, index) => completedTodos[index].id);

        const failedDeletions = results
          .filter(result => result.status === 'rejected')
          .map((_, index) => completedTodos[index].id);

        if (failedDeletions.length > 0) {
          setErrorMessage('Unable to delete a todo');
          deleteError();
        }

        setTodos(currentTodos =>
          currentTodos.filter(
            todo => !successfullyDeletedIds.includes(todo.id),
          ),
        );

        setLoadingIds(prevState =>
          prevState.filter(id => !successfullyDeletedIds.includes(id)),
        );
      })
      .finally(() => {
        setLoader(false);

        setLoadingIds(prevState =>
          prevState.filter(id => !completedTodoIds.includes(id)),
        );
      });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleNewTodo(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addTodo({
      title: titleNewTodo.trim(),
      completed: false,
      userId: todoService.USER_ID,
    });
  };

  const filteredTodos = todos
    .filter(todo => {
      if (filter === 'active') {
        return !todo.completed;
      }

      if (filter === 'completed') {
        return todo.completed;
      }

      return true;
    })
    .filter(todo => !(tempTodo && tempTodo.id === todo.id));

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          handleSubmit={handleSubmit}
          handleTitleChange={handleTitleChange}
          titleNewTodo={titleNewTodo}
          loader={loader}
          inputRef={inputRef}
        />

        <TodoList
          loadingIds={loadingIds}
          filteredTodos={filteredTodos}
          loader={loader}
          deleteTodo={deleteTodo}
          tempTodo={tempTodo}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            todosCount={todos.filter(todo => !todo.completed).length}
            clearCompleted={deleteCompletedTodos}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>
      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
