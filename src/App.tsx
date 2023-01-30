/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { Footer } from './components/Footer/Footer';
import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';

import { Todo } from './types/Todo';
import { TodosFilter } from './types/TodosFilted';

import { getTodos } from './api/todos';
import * as todosAPI from './api/todos';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [processings, setProcessings] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [todosFilter, setTodosFilter] = useState(TodosFilter.All);

  const addProcessings = (id: number) => {
    setProcessings(current => [...current, id]);
  };

  const removeProcessings = (idToRemove: number) => {
    setProcessings(
      current => current.filter(id => id !== idToRemove),
    );
  };

  const showError = useCallback((message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  }, []);

  const clearErrorMessage = useCallback(() => {
    setErrorMessage('');
  }, []);

  const filteredTodos = useMemo(() => todos.filter(todo => {
    switch (todosFilter) {
      case TodosFilter.Active:
        return !todo.completed;
      case TodosFilter.Completed:
        return todo.completed;
      case TodosFilter.All:
      default:
        return todo;
    }
  }), [todos, todosFilter]);

  const activeTodosAmount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => showError('Cant load todos'));
    }
  }, [user?.id]);

  const handleRemove = (todoId: number) => {
    addProcessings(todoId);

    todosAPI.deleteTodo(todoId)
      .then(() => {
        setTodos(
          current => current.filter(
            todo => todo.id !== todoId,
          ),
        );
      })
      .catch(() => showError('Can\'t delete a todo'))
      .finally(() => {
        removeProcessings(todoId);
      });
  };

  const handleAdd = (
    todo: Todo,
    todoField: React.RefObject<HTMLInputElement>,
  ) => {
    setIsAdding(true);

    todosAPI.addTodo(todo)
      .then(newTodo => {
        setTodos(current => [...current, newTodo]);
        filteredTodos.pop();
        filteredTodos.push(newTodo);

        setTitle('');
      })
      .catch(() => showError('Unable to add a todo'))
      .finally(() => {
        setIsAdding(false);

        requestAnimationFrame(() => todoField.current?.focus());
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          user={user}
          title={title}
          isAdding={isAdding}
          filteredTodos={filteredTodos}
          onTitleChange={setTitle}
          onError={showError}
          onAdd={handleAdd}
        />

        {
          !!todos.length && (
            <>
              <TodoList
                todos={filteredTodos}
                onRemove={handleRemove}
                processings={processings}
              />
              <Footer
                activeTodosAmount={activeTodosAmount}
                todos={todos}
                todoFilter={todosFilter}
                onFilterClick={setTodosFilter}
                onRemove={handleRemove}
              />
            </>
          )
        }
      </div>

      {
        errorMessage && (
          <ErrorMessage message={errorMessage} onClose={clearErrorMessage} />
        )
      }
    </div>
  );
};
