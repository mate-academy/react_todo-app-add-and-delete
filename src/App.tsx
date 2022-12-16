/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import {
  getTodos, addTodo, toggleStatus, removeTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { Errors } from './components/Errors/Errors';

export enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

type Title = {
  title?: null | string
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [isHidden, setIsHidden] = useState(true);
  const [filterStatus, setFilterStatus] = useState(FilterStatus.All);
  const [notCompleted, setNotCompleted] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Title>({ title: null });
  // const [activeTodo, setActiveTodo] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setTodoTitle('');
    const addNewTodo = async (data: Omit<Todo, 'id'>) => {
      try {
        const todo = await addTodo(data);

        setTodos((currentTodos): Todo[] | any => [...currentTodos, todo]);
        setVisibleTodos(
          (currentTodos): Todo[] | any => [...currentTodos, todo],
        );

        setTempTodo({ title: null });
      } catch {
        setErrorMessage('Unable to add a todo');
        setIsHidden(false);
        setTempTodo({ title: null });
      }
    };

    if (user === null) {
      return;
    }

    if (todoTitle.trim() === '') {
      setErrorMessage('Title can\'t be empty');
      setIsHidden(false);
    }

    if (todoTitle.trim() !== '') {
      setTempTodo({
        title: todoTitle,
      });
      addNewTodo({
        userId: user.id,
        title: todoTitle,
        completed: false,
      });
    }
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const loadTodosUser = async () => {
    if (user === null) {
      return;
    }

    setIsAdding(true);

    try {
      const todosUser = await getTodos(user.id);

      switch (filterStatus) {
        case FilterStatus.All:
          setTodos(todosUser);
          setVisibleTodos(todosUser);
          setNotCompleted((
            todosUser.filter(
              todo => todo.completed === false,
            )).length);
          break;

        case FilterStatus.Active:
          setVisibleTodos(todosUser.filter(todo => todo.completed === false));
          break;

        case FilterStatus.Completed:
          setVisibleTodos(todosUser.filter(todo => todo.completed === true));
          break;

        default:
          break;
      }

      setIsAdding(false);
      // const isTodo = todos.some(todo => todo.completed === true);

      // setActiveTodo(isTodo);
    } catch (error) {
      setErrorMessage('Unable load todos');
      setIsHidden(false);
    }
  };

  const handleRemoveTodo = async (id: number) => {
    const removeTodoById = async (idTodo: number) => {
      try {
        await removeTodo(idTodo);
        loadTodosUser();
      } catch {
        setErrorMessage('Unable to delete a todo');
        setIsHidden(false);
      }
    };

    removeTodoById(id);
  };

  const handleClick = async (id: number, completed: boolean) => {
    await toggleStatus(id, { completed: !completed });
    loadTodosUser();
  };

  const removeAllDone = () => {
    const completed = todos.filter(todo => todo.completed === true);

    completed.forEach(todo => {
      handleRemoveTodo(todo.id);
    });
  };

  // load todo, filter todo
  useEffect(() => {
    loadTodosUser();
  }, [filterStatus]);

  // hide error after 3 sec
  useEffect(() => {
    const hide = setTimeout(() => {
      setIsHidden(true);
    }, 3000);

    return () => clearTimeout(hide);
  }, [isHidden]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          handleSubmit={handleSubmit}
          todoTitle={todoTitle}
          onChange={onChange}
          isAdding={isAdding}
        />

        <TodoList
          todos={todos}
          visibleTodos={visibleTodos}
          handleClick={handleClick}
          handleRemoveTodo={handleRemoveTodo}
          tempTodo={tempTodo}
        />

        {todos.length !== 0
        && (
          <Footer
            notCompleted={notCompleted}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            todos={todos}
            removeAllDone={removeAllDone}
          />
        )}
      </div>

      <Errors
        isHidden={isHidden}
        setIsHidden={setIsHidden}
        errorMessage={errorMessage}
      />
      {/* <div
        data-cy="ErrorNotification"
        className={
          classNames('notification is-danger is-light has-text-weight-normal', {
            'hidden ': isHidden,
          })
        }
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setIsHidden(true)}
        />
        {errorMessage}
      </div> */}
    </div>
  );
};
