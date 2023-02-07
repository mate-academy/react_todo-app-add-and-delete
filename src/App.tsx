/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
} from 'react';

import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { ErrorPanel } from './components/ErrorPanel';

import { Todo } from './types/Todo';
import { Filters } from './types/Filters';
import { Errors } from './types/Errors';

import { getTodos, addTodo, removeTodo } from './api/todos';

const USER_ID = 6160;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Errors>(Errors.NoError);
  const [isEditing] = useState(false);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>(todos);
  const [selectedFilter, setSelectedFilter] = useState<Filters>(Filters.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [areTodosLoading, setAreTodosLoading] = useState(false);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const onNewTitleAdd = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const createNewTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.length) {
      setError(Errors.TitleIsEmpty);
    }

    setAreTodosLoading(true);

    const todoToAdd: Todo = {
      id: 0,
      userId: USER_ID,
      title: newTodoTitle,
      completed: false,
    };

    setTempTodo(todoToAdd);

    addTodo(todoToAdd)
      .then((newTodo) => {
        setTodos([...todos, newTodo]);
        setFilteredTodos([...todos, newTodo]);
        setTempTodo(null);
        setAreTodosLoading(false);
      })
      .catch(() => {
        setError(Errors.CantAdd);
      });

    setNewTodoTitle('');
  };

  const deleteTodo = (todoId: number) => {
    removeTodo(todoId)
      .then(() => {
        setLoadingTodoIds([...loadingTodoIds, todoId]);
        getTodos(USER_ID)
          .then(todosFromServer => {
            setTodos(todosFromServer);
            setFilteredTodos(todosFromServer);
            setLoadingTodoIds(loadingTodoIds.filter(id => id !== todoId));
          })
          .catch(() => {
            setError(Errors.CantRemove);
          });
      });

    setLoadingTodoIds([]);
  };

  const onClearCompleted = () => {
    setLoadingTodoIds(
      [...loadingTodoIds, ...completedTodos.map(todo => todo.id)],
    );

    Promise.all(completedTodos.map(todo => removeTodo(todo.id)))
      .then(() => {
        getTodos(USER_ID)
          .then(todosFromServer => {
            setTodos(todosFromServer);
            setFilteredTodos(todosFromServer);
          })
          .catch(() => {
            setError(Errors.CantRemove);
          });
        setLoadingTodoIds([]);
      });
  };

  const onFilterAll = () => {
    setSelectedFilter(Filters.All);
    setFilteredTodos(todos);
  };

  const onFilterActive = () => {
    setSelectedFilter(Filters.Active);
    setFilteredTodos(activeTodos);
  };

  const onFilterCompleted = () => {
    setSelectedFilter(Filters.Completed);
    setFilteredTodos(completedTodos);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(todosFromServer => {
        setTodos(todosFromServer);
        setFilteredTodos(todosFromServer);
        setError(Errors.NoError);
      })
      .catch(() => {
        setError(Errors.CantLoad);
      });
  }, []);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(Errors.NoError);
      }, 3000);
    }
  }, [error]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoTitle={newTodoTitle}
          onNewTitleAdd={onNewTitleAdd}
          createNewTodo={createNewTodo}
          activeTodos={activeTodos}
          areTodosLoading={areTodosLoading}
        />
        <>
          <Main
            isEditing={isEditing}
            filteredTodos={filteredTodos}
            deleteTodo={deleteTodo}
            tempTodo={tempTodo}
            loadingTodoIds={loadingTodoIds}
          />
          <Footer
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            onFilterActive={onFilterActive}
            onFilterAll={onFilterAll}
            onFilterCompleted={onFilterCompleted}
            selectedFilter={selectedFilter}
            onClearCompleted={onClearCompleted}
          />
        </>

      </div>
      {error && (
        <ErrorPanel
          errorMessage={error}
          clearError={() => setError(Errors.NoError)}
        />
      )}

    </div>
  );
};
