/* eslint-disable no-console */
import React, {
  // FormEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';

import { Todo } from './types/Todo';
import { deleteTodo, getTodos, postTodo } from './api/todos';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [title, setTitle] = useState('');
  const [isTodoAdded, setIsTodoAdded] = useState(false);
  const [selectedTodosId, setSelectedTodosId] = useState<number[]>([]);

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodos(user?.id || 0)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const hundleAddTodo = async (inputTitle: string) => {
    setTitle(inputTitle);
    setIsTodoAdded(true);

    try {
      if (user) {
        const newTodo = await postTodo(user.id, inputTitle);

        setTodos([...todos, newTodo]);
      }
    } catch {
      setErrorMessage('Unable to add todo');
    } finally {
      setIsTodoAdded(false);
      if (newTodoField.current) {
        newTodoField.current.focus();
      }
    }
  };

  const hundleDeleteTodo = (todosId: number[]) => {
    setSelectedTodosId(todosId);
    todosId.map(todoId => (
      deleteTodo(todoId)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(({ id }) => id !== todoId));
        })
        .catch(() => {
          setErrorMessage('Unable to delete todo');
        })
    ));
  };

  const filteredTodos = todos.filter(({ completed }) => {
    switch (filterValue) {
      case 'active':
        return !completed;

      case 'completed':
        return completed;

      default:
        return true;
    }
  });

  const activeTodosTotal = useMemo(() => {
    return todos.filter(({ completed }) => !completed).length;
  }, [todos]);

  const completedTodosId = useMemo(() => {
    return todos.reduce((todosId: number[], currTodo: Todo) => {
      if (currTodo.completed) {
        todosId.push(currTodo.id);
      }

      return todosId;
    }, []);
  }, [todos]);

  const isLeftActiveTodos = activeTodosTotal === todos.length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          isLeftActiveTodos={isLeftActiveTodos}
          onAddTodo={hundleAddTodo}
          isDisabled={isTodoAdded}
          setErrorMessage={setErrorMessage}
        />
        {!!todos.length && (
          <TodoList
            todos={filteredTodos}
            isAdding={isTodoAdded}
            selectedTodosId={selectedTodosId}
            newTitle={title}
            onDelete={hundleDeleteTodo}
          />
        )}
        {!!todos.length && (
          <Footer
            activeTodosTotal={activeTodosTotal}
            isLeftActiveTodos={isLeftActiveTodos}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            completedTodosId={completedTodosId}
            onDelete={hundleDeleteTodo}
          />
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
