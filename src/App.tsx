/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { AddTodo } from './components/Auth/AddTodo';
import { Todo } from './types/Todo';
import {
  addTodos, getTodos, editTodo, deleteTodo,
} from './api/todos';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoList } from './components/Auth/TodoList';
import { Footer } from './components/Auth/Footer';
import { Error } from './components/Auth/Error';
import { FilterTodos } from './utils/FilterTodos';
// import { User } from './types/User';
const defaultTodo = {
  id: 0,
  userId: 0,
  title: '',
  completed: false,
};

export const App: React.FC = () => {
  // export enum FilterTodos {
  //   ALL = 'All',
  //   ACTIVE = 'Active',
  //   COMLETED = 'Completed',
  // }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(FilterTodos.ALL);
  const [queryOfTitle, setQueryOfTitle] = useState('');
  const [hasError, setHasError] = useState(false);
  const [messageError, setMessageError] = useState(ErrorMessage.None);
  const [isAdding, setIsAdding] = useState(false);
  // const [isCompleted, setIsCompleted] = useState(false);
  // const [deleteCompletedTodo, setDeleteCompletdTodo] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo>(defaultTodo);
  // const [addError, setAddError] = useState(false);
  // const [deleteError, setDeleteError] = useState(false);
  // const [updateError, setUpdateError] = useState(false);
  const [isLoading, setIsLoading] = useState<number[]>([]);

  const getTodosFromServer = async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      }
    } catch (err) {
      setHasError(true);
      setMessageError(ErrorMessage.LoadError);
      // setTimeout(() => {
      //   setHasError(false);
      // }, 3000);
    }
  };

  // const handleDeleteTodo = async (id: number) => {
  //   try {
  //     await deleteTodo(id);
  //     getTodosFromServer();
  //   } catch (err) {
  //     setHasError(true);
  //     setDeleteError(true);
  //   }
  // };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosFromServer();
  }, []);

  const filteredTodos = todos.filter(todo => {
    switch (filterBy) {
      case FilterTodos.ACTIVE:
        return !todo.completed;
      case FilterTodos.COMLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  const deleteCompleted = () => {
    return todos.map(async (todo) => {
      if (todo.completed === true) {
        // const newTodo =
        await deleteTodo(todo.id);

        await getTodosFromServer();
      }

      return todo;
    });
  };

  // const handleEditTodo = async (id: number, comleted: boolean) => {
  //   setIsCompleted(comleted);
  //   editTodo(id, comleted);
  //   getTodosFromServer();
  // };

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setIsAdding(true);

      const trimtitle = queryOfTitle.trim();

      if (!trimtitle) {
        setMessageError(ErrorMessage.TitleError);
        setHasError(true);
        setQueryOfTitle('');

        return;
      }

      if (user && !hasError) {
        await addTodos(user.id, trimtitle);
        await getTodosFromServer();
      }

      setIsAdding(false);
      setQueryOfTitle('');
    } catch (err) {
      setHasError(true);
      setMessageError(ErrorMessage.AddError);
    }

    // event.preventDefault();
    // setIsAdding(true);

    // const trimtitle = queryOfTitle.trim();

    // if (!trimtitle) {
    //   setMessageError(ErrorMessage.TitleError);
    //   setHasError(true);
    //   setQueryOfTitle('');

    //   return;
    // }

    // if (user && !hasError) {
    //   await addTodos(user.id, trimtitle);
    //   getTodosFromServer();
    // }

    // setIsAdding(false);
    // setQueryOfTitle('');
  };

  const handleQueryOfTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const temporaryTodo = {
      id: 0,
      userId: user?.id || 0,
      title: event.target.value,
      completed: false,
    };

    setTempTodo(temporaryTodo);
    setQueryOfTitle(event.target.value);
  };

  const activeTodos = todos.filter(todo => todo.completed === false).length;
  const completedTodos = todos.filter(todo => todo.completed === true).length;

  const editAllTodos = () => {
    return todos.map(async (todo) => {
      if (todo.completed === false) {
        // const newTodo =
        await editTodo(todo.id, { completed: true });

        await getTodosFromServer();
      }
      // return newTodo;
      // } else {
      //   await editTodo(todo.id, true);

      //   getTodosFromServer();
      // }

      return todo;
    });

    // setTodos(newListOFTodos);
  };

  const isAllTodosCompleted = todos.length === completedTodos;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={cn('todoapp__toggle-all',
              { active: isAllTodosCompleted })}
            onClick={editAllTodos}
          />
          <AddTodo
            newTodoField={newTodoField}
            handleQueryOfTitle={handleQueryOfTitle}
            queryOfTitle={queryOfTitle}
            handleOnSubmit={handleOnSubmit}
            isAdding={isAdding}
          />
        </header>
        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            getTodosFromServer={getTodosFromServer}
            isAdding={isAdding}
            tempTodo={tempTodo}
            setHasError={setHasError}
            setMessageError={setMessageError}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            // handleDeleteTodo={handleDeleteTodo}
            // isCompleted={isCompleted}
          />
        )}
        <Footer
          activeTodos={activeTodos}
          completedTodos={completedTodos}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          deleteCompleted={deleteCompleted}
        />
      </div>
      {hasError && (
        <Error
          hasError={hasError}
          setHasError={setHasError}
          messageError={messageError}
        />
      )}
    </div>
  );
};
