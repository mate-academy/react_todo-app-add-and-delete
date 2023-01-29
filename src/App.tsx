/* eslint-disable jsx-a11y/control-has-associated-label */
// eslint-disable-next-line object-curly-newline
import React, { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line object-curly-newline
import { getTodos, createTodo, deleteTodo, updateTodo } from './api/todos';
import { filterTotos } from './api/filter';
import { useAuthContext } from './components/Auth/useAuthContext';
// eslint-disable-next-line object-curly-newline
import { ErrorNotification, Header, TodoList, Footer } from './components';
import { Todo, FilterTypes, ErrorTypes } from './types';

export const App: React.FC = () => {
  const user = useAuthContext();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [typeFilter, setTypeFilter] = useState(FilterTypes.All);
  const [error, setError] = useState('');
  const [isHiddenErrorNote, setIsHiddenErrorNote] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const newTodoField = useRef<HTMLInputElement>(null);
  const visibleTodos = filterTotos(todos, typeFilter);
  const activeTodosCount = filterTotos(todos, FilterTypes.Active).length;
  const completedTodosCount = filterTotos(todos, FilterTypes.Completed).length;
  const allCompleted = todos.length === completedTodosCount;

  function hiddenErrorNote() {
    setIsHiddenErrorNote(false);
    setTimeout(() => {
      setIsHiddenErrorNote(true);
    }, 3000);
  }

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    setIsAdding(true);

    if (user) {
      getTodos(user.id)
        .then((res) => setTodos(res))
        .catch(() => {
          setError(ErrorTypes.Loading);
          hiddenErrorNote();
        })
        .finally(() => setIsAdding(false));
    }
  }, []);

  const addTodoHandler = (titleTodo: string) => {
    if (!user) {
      return;
    }

    if (!titleTodo.trim()) {
      setTitle('');
      setError(ErrorTypes.Empty);
      hiddenErrorNote();

      return;
    }

    const todo = {
      title: titleTodo,
      userId: user?.id,
      completed: false,
    };

    setIsAdding(true);

    createTodo(todo)
      .then((res) => setTodos((prevTodos) => [...prevTodos, res]))
      .catch(() => {
        setError(ErrorTypes.Add);
        hiddenErrorNote();
      })
      .finally(() => {
        setTitle('');
        setIsAdding(false);
      });
  };

  const deleteTodoHandler = (id: number) => {
    deleteTodo(id)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      })
      .catch(() => {
        setError(ErrorTypes.Remove);
        setTimeout(() => {
          setIsHiddenErrorNote(true);
        }, 3000);
      });
  };

  const deleteCompletedTodosHandler = () => {
    todos.map((todo) => (todo.completed ? deleteTodoHandler(todo.id) : todo));
  };

  const updateTodoHandler = (id: number, state: boolean) => {
    updateTodo(id, state).then((res) => {
      setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === res.id
        ? { ...todo, completed: res.completed }
        : { ...todo })));
    });
  };

  const toggleTodoHandler = (id: number) => {
    const selectedTodo = todos.find((todo) => id === todo.id);
    const updateCompleted = !selectedTodo?.completed;

    if (!selectedTodo) {
      return;
    }

    updateTodoHandler(id, updateCompleted);
  };

  const completedAllTodoHandler = () => {
    todos.map((todo) => (allCompleted
      ? updateTodoHandler(todo.id, false)
      : updateTodoHandler(todo.id, true)));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          ref={newTodoField}
          title={title}
          setTitle={setTitle}
          onAddToto={addTodoHandler}
          isAdding={isAdding}
          completedAllTodo={completedAllTodoHandler}
          allCompleted={allCompleted}
        />
        <TodoList
          todos={visibleTodos}
          deleteTodo={deleteTodoHandler}
          toggleTodo={toggleTodoHandler}
        />
        {!!todos.length && (
          <Footer
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            completedTodosCount={completedTodosCount}
            activeTodosCount={activeTodosCount}
            deleteCompletedTodos={deleteCompletedTodosHandler}
          />
        )}
      </div>
      <ErrorNotification
        isHidden={isHiddenErrorNote}
        setIsHidden={setIsHiddenErrorNote}
        error={error}
      />
    </div>
  );
};
