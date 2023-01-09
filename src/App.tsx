import React, {
  useContext, useEffect, useState,
} from 'react';
import {
  getTodos,
  addTodo,
  CustomTodo,
  deleteTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer/Footer';
import Form from './components/Form/Form';
import TodoList from './components/TodoList/TodoList';
import Warning from './components/Warning/warning';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todosFromTheServer, setTodosFromTheServer] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [todosToShow, setTodosToShow] = useState([...todosFromTheServer]);
  const [currentFilter, setCurrentFilter] = useState('ALL');
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingCompleted, setDelitingCompleted] = useState(false);
  const [customTodo, setCustomTodo] = useState<CustomTodo | null>(null);

  const user = useContext(AuthContext);

  const filterTodos = (type: string) => {
    setCurrentFilter(type);
    switch (type) {
      case 'COMPLETED': {
        const completedTodos = todosFromTheServer.filter(
          todo => todo.completed,
        );

        setTodosToShow(completedTodos);
        break;
      }

      case 'ACTIVE': {
        const activeTodos = todosFromTheServer.filter(
          todo => !todo.completed,
        );

        setTodosToShow(activeTodos);
        break;
      }

      default: {
        setTodosToShow(todosFromTheServer);
      }
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    getTodos(user.id)
      .then(gotTodos => {
        setTodosFromTheServer(gotTodos);
        setTodosToShow([...gotTodos]);
      })
      .catch(() => setErrorMessage('Unable to get todos'));
  }, []);

  useEffect(() => filterTodos(currentFilter), [todosFromTheServer]);

  const onFormSubmit = (value: string) => {
    setIsAdding(true);

    if (!value.trim) {
      setErrorMessage("Title can't be empty");

      return;
    }

    if (!user) {
      return;
    }

    const newTodo = {
      userId: user.id,
      title: value,
      completed: false,
    };

    setCustomTodo(newTodo);

    addTodo(newTodo).then((todo) => {
      setTodosFromTheServer(prevTodos => [...prevTodos, todo]);
    }).catch(() => {
      setErrorMessage('Unable to add todo');
    }).finally(() => {
      setIsAdding(false);
      setCustomTodo(null);
    });
  };

  const onDeleteTodo = (todoId: number) => {
    setIsDeleting(true);
    deleteTodo(todoId)
      .then(() => {
        setTodosFromTheServer(
          prevTodos => prevTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => setErrorMessage('Unable to delete the todo'))
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const clearCompleted = () => {
    setDelitingCompleted(true);
    const completed = todosFromTheServer.filter(todo => todo.completed);

    Promise.all(completed.map(todo => deleteTodo(todo.id)))
      .then(() => setTodosFromTheServer(
        prev => prev.filter(todo => !todo.completed),
      )).catch(() => setErrorMessage('Something went wrong deleting the todos'))
      .finally(() => setDelitingCompleted(false));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
            aria-label="Toggle all"
          />

          <Form onSubmit={onFormSubmit} isAdding={isAdding} />
        </header>

        {todosFromTheServer.length > 0 && (
          <>
            <TodoList
              todos={todosToShow}
              customTodo={customTodo}
              onDeleteTodo={onDeleteTodo}
              isDeleting={isDeleting}
              deletingCompleted={deletingCompleted}
            />

            <Footer
              left={todosFromTheServer.filter(todo => !todo.completed).length}
              completed={
                todosFromTheServer.filter(todo => todo.completed).length
              }
              onFilter={filterTodos}
              onClearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      <Warning message={errorMessage} />
    </div>
  );
};
