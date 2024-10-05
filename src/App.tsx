/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TempTodoItem } from './components/TempTodoItem';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletedTodoId, setDeletedTodoId] = useState<number | null>(null);
  const [titleNewTodo, setTitleNewTodo] = useState<string>('');
  const [loader, setLoader] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('all');
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const deleteError = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
        deleteError();
      });
  }, []);

  function addTodo({ title, completed, userId }: Omit<Todo, 'id'>) {
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
        setTitleNewTodo('');
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        deleteError();
      })
      .finally(() => {
        setLoader(false);
        inputRef.current?.focus();
      });
  }

  function deleteTodo(todoId: number) {
    const todoToDelete = todos.find(todo => todo.id === todoId);

    if (!todoToDelete) {
      return;
    }

    setTempTodo(todoToDelete);
    setDeletedTodoId(todoId);
    setLoader(true);

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setTempTodo(null);
        setDeletedTodoId(null);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        deleteError();
        setTempTodo(null);
      })
      .finally(() => {
        setLoader(false);
        inputRef.current?.focus();
      });
  }

  function deleteCompletedTodos() {
    const completedTodos = todos.filter(todo => todo.completed);

    setLoader(true);
    Promise.all(completedTodos.map(todo => todoService.deleteTodo(todo.id)))
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => !todo.completed));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        deleteError();
      })
      .finally(() => {
        setLoader(false);
        inputRef.current?.focus();
      });
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleNewTodo(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addTodo({
      title: titleNewTodo,
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

        {filteredTodos.map(todo => (
          <TodoList
            key={todo.id}
            todo={todo}
            loader={loader}
            deleteTodo={deleteTodo}
          />
        ))}

        {tempTodo && deletedTodoId === null && (
          <section className="todoapp__main">
            <TempTodoItem todo={tempTodo} loader={loader} />
          </section>
        )}

        {todos.length > 0 && (
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
