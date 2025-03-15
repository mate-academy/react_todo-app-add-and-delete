import React, { FormEventHandler, useEffect, useMemo, useState } from 'react';
import { UserWarning } from '../UserWarning';
import { deleteTodo, getTodos, postTodo, USER_ID } from '../api/todos';
import { Header } from './Header';
import { Main } from './Main';
import { Footer } from './Footer';
import { Todo } from '../types/Todo';
import { ERROR, ErrorType } from '../types/Error';
import { FILTER, Filter } from '../types/Filter';
import { Status, STATUS } from '../types/Status';
import { ErrorMessage } from './ErrorMessage';
export const App: React.FC = () => {
  const [filter, setFilter] = useState<Filter>(FILTER.all);
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [status, setStatus] = useState<Status>(STATUS.idle);
  const [errorType, setErrorType] = useState<ErrorType>(ERROR.noError);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState<number[]>([]);
  const loadedTodos = () => {
    return getTodos()
      .then(data => {
        setTodos(data);
        setStatus(STATUS.resolved);
      })
      .catch(() => setErrorType(ERROR.couldntLoadTodos));
  };

  const completedTodos = todos.filter(todo => todo.completed);

  const addTodo = (todo: Todo) => {
    setTodos([...todos, todo]);
  };

  const handleSumbit: FormEventHandler = event => {
    event.preventDefault();
    const title = newTodoTitle.trim();

    if (!title) {
      setErrorType(ERROR.noTitle);

      return;
    }

    if (title) {
      postTodo({
        id: 0,
        userId: USER_ID,
        title: title,
        completed: false,
      })
        .then(response => {
          setErrorType(ERROR.noError);
          setNewTodoTitle('');
          addTodo(response);
        })
        .catch(() => {
          setErrorType(ERROR.unableToAdd);
        })
        .finally(() => {
          setTempTodo(null);
        });
      const newTodo: Todo = {
        id: 0,
        userId: USER_ID,
        title: title,
        completed: false,
      };

      setTempTodo(newTodo);
    }
  };

  const handleDeletion = (todoId: number) => {
    setIsLoading(prev => [...prev, todoId]);
    deleteTodo(todoId)
      .then(() => {
        setTodos(prev =>
          prev.filter(searchedTodo => searchedTodo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorType(ERROR.unableToDelete);
      });
  };

  const clearCompleted = () => {
    setIsLoading([]);
    completedTodos.forEach(todo => handleDeletion(todo.id));
  };

  const filteredTodos = useMemo(() => {
    let filterTodos = todos;

    switch (filter) {
      case FILTER.all:
        break;
      case FILTER.active:
        filterTodos = todos.filter(todo => !todo.completed);
        break;
      case FILTER.completed:
        filterTodos = todos.filter(todo => todo.completed);
        break;
      default:
        break;
    }

    return filterTodos;
  }, [filter, todos]);

  useEffect(() => {
    setErrorType(ERROR.noError);
    setStatus(STATUS.pending);
    loadedTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          tempTodo={tempTodo}
          handleSubmit={handleSumbit}
          errorType={errorType}
          todos={todos}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
        />
        {status === 'resolved' && (
          <Main
            isLoading={isLoading}
            handleDeletion={handleDeletion}
            setTodos={setTodos}
            tempTodo={tempTodo}
            todos={filteredTodos}
          />
        )}
        {status === 'resolved' && todos.length !== 0 && (
          <Footer
            clearCompleted={clearCompleted}
            setErrorType={setErrorType}
            setTodos={setTodos}
            todos={todos}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>

      <ErrorMessage error={errorType} setErrorType={setErrorType} />
    </div>
  );
};
