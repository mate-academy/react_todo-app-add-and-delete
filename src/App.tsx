/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { addTodo, deleteTodoById, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { CompletedFilter } from './types/CompletedFilter';
import { Header } from './components/Header';
import { Todolist } from './components/Todolist';
import { Footer } from './components/Footer';
import { Errornotification } from './components/Errornotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedFilter, setCompletedFilter] = useState(CompletedFilter.All);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const [todosByDeleting, setTodosByDeleting] = useState([0]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const showError = useCallback((message: string) => {
    setErrorMessage(message);

    setTimeout(() => setErrorMessage(''), 3000);
  }, []);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => showError('Can\'t load todos'));
    }
  }, []);

  const closeErrorMessage = useCallback(() => {
    setErrorMessage('');
  }, []);

  const uncompletedTodosAmount = useMemo(() => {
    const uncompletedTodos = todos.filter(todo => !todo.completed);

    return uncompletedTodos.length;
  }, [todos]);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (completedFilter) {
        case CompletedFilter.All:
          return todo;

        case CompletedFilter.Active:
          return todo.completed === false;

        case CompletedFilter.Completed:
          return todo.completed === true;

        default:
          return null;
      }
    });
  }, [todos, completedFilter]);

  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title) {
      const todoForBack: Todo = {
        userId: user?.id || 0,
        title,
        completed: false,
      };

      setTemporaryTodo({
        id: 0,
        ...todoForBack,
      });

      setIsAdding(true);

      addTodo(todoForBack)
        .then((newTodo) => {
          setTodos([...todos, newTodo]);
        })
        .catch(() => showError('Unable to add a todo'))
        .finally(() => {
          setTitle('');
          setTemporaryTodo(null);
          setIsAdding(false);
        });
    } else {
      showError('title can\'t be empty');
    }
  };

  const handleDeleteTodo = (todoId: number) => {
    setTodosByDeleting(
      (currentDeletetingTodos) => [...currentDeletetingTodos, todoId],
    );

    deleteTodoById(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos
          .filter(currentTodo => currentTodo.id !== todoId));

        setTodosByDeleting(
          (currentDeletetingTodos) => (
            currentDeletetingTodos.filter(deletingId => deletingId !== todoId)
          ),
        );
      })
      .catch(() => showError('Unable to delete a todo'));
  };

  const removeCompletedTodos = () => {
    todos.forEach(todo => {
      if (!todo.completed) {
        handleDeleteTodo(todo.id || 0);
      }
    });
  };

  const hasCompletedTodos = todos
    .filter(todoItem => todoItem.completed).length > 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          title={title}
          isAdding={isAdding}
          onSubmitForm={onSubmitForm}
          setTitle={setTitle}
        />

        {todos.length > 0 && (
          <>
            <Todolist
              todos={visibleTodos}
              temporaryTodo={temporaryTodo}
              todosByDeleting={todosByDeleting}
              handleDeleteTodo={handleDeleteTodo}
            />
            <Footer
              uncompletedTodosAmount={uncompletedTodosAmount}
              completedFilter={completedFilter}
              hasCompletedTodos={hasCompletedTodos}
              removeCompletedTodos={removeCompletedTodos}
              setCompletedFilter={setCompletedFilter}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <Errornotification
          message={errorMessage}
          close={closeErrorMessage}
        />
      )}
    </div>
  );
};
