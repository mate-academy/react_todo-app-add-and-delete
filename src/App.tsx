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

import { getTodos, addTodo, removeTodo } from './api/todos';

const USER_ID = 6160;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [isEditing] = useState(false);
  // const [hasChangesInTodos, setHasChangesInTodos] = useState(0);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>(todos);
  const [selectedFilter, setSelectedFilter] = useState<Filters>(Filters.All);
  const [todoTitleToAdd, setTodoTitleToAdd] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [idsOfLoadingTodos, setIdsOfLoadingTodos] = useState<number[]>([]);
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const onNewTitleAdd = (event: ChangeEvent<HTMLInputElement>) => {
    setTodoTitleToAdd(event.target.value);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (todoTitleToAdd) {
      setIsInputDisabled(true);
      const todoToAdd: Todo = {
        id: 0,
        userId: USER_ID,
        title: todoTitleToAdd,
        completed: false,
      };

      setTempTodo(todoToAdd);

      addTodo(todoToAdd)
        .then((newTodo) => {
          setTodos([...todos, newTodo]);
          setFilteredTodos([...todos, newTodo]);
          setTempTodo(null);
          setIsInputDisabled(false);
        })
        .catch(() => {
          setError('Unable to add a todo');
        });
      setTodoTitleToAdd('');
    } else {
      setError('Title can\'t be empty');
    }
  };

  const onRemove = (todoId: number) => {
    removeTodo(todoId)
      .then(() => {
        setIdsOfLoadingTodos([...idsOfLoadingTodos, todoId]);
        getTodos(USER_ID)
          .then(todosFromServer => {
            setTodos(todosFromServer);
            setFilteredTodos(todosFromServer);
            setIdsOfLoadingTodos(idsOfLoadingTodos.filter(id => id !== todoId));
          })
          .catch(() => {
            setError('Unable to delete a todo');
          });
      });

    setIdsOfLoadingTodos([]);
  };

  const onClearCompleted = () => {
    setIdsOfLoadingTodos(
      [...idsOfLoadingTodos, ...completedTodos.map(todo => todo.id)],
    );

    Promise.all(completedTodos.map(todo => removeTodo(todo.id)))
      .then(() => {
        getTodos(USER_ID)
          .then(todosFromServer => {
            setTodos(todosFromServer);
            setFilteredTodos(todosFromServer);
          })
          .catch(() => {
            setError('Unable to delete a todo');
          });
        setIdsOfLoadingTodos([]);
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
        setError('');
      })
      .catch(() => {
        setError('There was an error loading the content');
      });
  }, []);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  }, [error]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todoTitleToAdd={todoTitleToAdd}
          onNewTitleAdd={onNewTitleAdd}
          onSubmit={onSubmit}
          activeTodos={activeTodos}
          isInputDisabled={isInputDisabled}
        />
        <>
          <Main
            isEditing={isEditing}
            filteredTodos={filteredTodos}
            onRemove={onRemove}
            tempTodo={tempTodo}
            idsOfLoadingTodos={idsOfLoadingTodos}
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
          clearError={() => setError('')}
        />
      )}

    </div>
  );
};
