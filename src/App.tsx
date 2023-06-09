/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoFilter } from './types/TodoFilter';
import { ErrorNotification } from './types/ErrorNotification';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { TodoError } from './components/TodoError/TodoError';
import { Todo } from './types/Todo';
import { RequestTodos } from './types/RequestTodos';

const USER_ID = 10644;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoFilter, setTodoFilter] = useState<TodoFilter>(TodoFilter.ALL);
  const [errorNotification, setErrorNotification]
    = useState<ErrorNotification>(ErrorNotification.NONE);
  const [search, setSearch] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosForDeleting, setTodosForDeleting] = useState<number[]>([]);
  const [completedID, setCompletedsID] = useState<number[]>([]);

  const initialTodos = useMemo(() => {
    return (todos.filter(todo => {
      switch (todoFilter) {
        case TodoFilter.ACTIVE:
          return !todo.completed;
        case TodoFilter.COMPLETED:
          return todo.completed;
        default:
          return todo;
      }
    }));
  }, [todoFilter, todos]);

  const fetchData = async () => {
    try {
      const todosData = await getTodos(USER_ID);

      setTodos(todosData);
    } catch {
      setErrorNotification(ErrorNotification.LOAD);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCompletedsID(todos
      .filter(todo => todo.completed)
      .map(todo => todo.id));
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = async () => {
    const newTodo: RequestTodos = {
      userId: USER_ID,
      completed: false,
      title: search,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    createTodo(USER_ID, newTodo)
      .then(res => setTodos(prevTodos => [...prevTodos, res]))
      .catch(() => setErrorNotification(ErrorNotification.ADD))
      .finally(() => setTempTodo(null));

    setSearch('');
  };

  const handleDeleteTodo = async (id: number) => {
    setTempTodo({
      id,
      userId: 0,
      title: '',
      completed: false,
    });

    deleteTodo(id)
      .then(() => setTodos(prevTodos => prevTodos
        .filter(todo => todo.id !== id)))
      .catch(() => setErrorNotification(ErrorNotification.DELETE))
      .finally(() => setTempTodo(null));
  };

  const deleteTodosCompleted = async (idsForDeleting: number[]) => {
    setTodosForDeleting([...idsForDeleting]);
    todos.filter(todo => todo.completed)
      .map(todo => handleDeleteTodo(todo.id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          search={search}
          setSearch={setSearch}
          addTodo={addTodo}
          setErrorNotification={setErrorNotification}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={initialTodos}
              handleDeleteTodo={handleDeleteTodo}
              tempTodo={tempTodo}
              todosForDeleting={todosForDeleting}
            />
            <Footer
              todos={initialTodos}
              todoFilter={todoFilter}
              setTodoFilter={setTodoFilter}
              deleteTodosCompleted={deleteTodosCompleted}
              completedId={completedID}
            />
          </>
        )}
      </div>

      {errorNotification && (
        <TodoError
          errorNotification={errorNotification}
          closeError={() => setErrorNotification(ErrorNotification.NONE)}
        />
      )}
    </div>
  );
};
