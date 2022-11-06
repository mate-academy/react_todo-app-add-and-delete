import React, {
  useCallback,
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { getTodos, postTodo, removeTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoAddForm } from './components/TodoAddForm';
import { TodoErrorNotification } from './components/TodoErrorNotification';
import { TodoFilter } from './components/TodoFilter';
import { TodoList } from './components/TodoList';
import { Errors } from './types/Errors';
import { FilterValues } from './types/FilterValues';
import { Todo } from './types/Todo';
import { loading } from './utils/fetchClient';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [errorNotification, setErrorNotification]
    = useState<Errors | null>(null);
  const [selectedFilter, setSelectedFilter]
    = useState<FilterValues>(FilterValues.All);
  const [isAdding, setIsAdding] = useState(true);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);

  const getVisibleTodos = () => {
    return [...todos].filter((todo) => {
      switch (selectedFilter) {
        case FilterValues.Completed:
          return todo.completed;
        case FilterValues.Active:
          return !todo.completed;
        default:
          return todo;
      }
    });
  };

  const visibleTodos = useMemo(
    getVisibleTodos,
    [selectedFilter, todos],
  );

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    (async () => {
      if (user) {
        setErrorNotification(null);
        const loadedTodos = await getTodos(user.id);

        setTodos(loadedTodos);
        setIsAdding(false);
      }
    })();
  }, []);

  const addTodo = useCallback(async () => {
    try {
      if (user) {
        const newTodo = await postTodo(user.id, newTodoTitle);

        setCurrentTodo(newTodo);
        setTodos((prevTodos) => [...prevTodos, newTodo]);
        loading(() => setCurrentTodo(null));
      }
    } catch {
      setErrorNotification(Errors.onAddError);
    }

    setNewTodoTitle('');
  }, [newTodoTitle]);

  const deleteTodo = useCallback(async (todo: Todo) => {
    try {
      if (user) {
        setCurrentTodo(todo);
        await removeTodo(todo);
        setTodos((prevTodos) => {
          return prevTodos.filter(item => item !== todo);
        });
        loading(() => setCurrentTodo(null));
      }
    } catch {
      setErrorNotification(Errors.onDeleteError);
    }
  }, [todos]);

  const clearCompleted = useCallback(async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(completedTodos.map(todo => removeTodo(todo)));

    setTodos((prevTodos) => {
      return prevTodos.filter((item) => !item.completed);
    });
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoAddForm
          isAdding={isAdding}
          newTodoField={newTodoField}
          newTodoTitle={newTodoTitle}
          onTitleChange={(title: string) => setNewTodoTitle(title)}
          onAdd={addTodo}
          changeErrors={setErrorNotification}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              currentTodo={currentTodo}
              deleteTodo={deleteTodo}
            />

            <TodoFilter
              completed={todos.filter(todo => todo.completed).length}
              selectedFilter={selectedFilter}
              onSelection={(filter:FilterValues) => setSelectedFilter(filter)}
              clearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      <TodoErrorNotification
        errorNotification={errorNotification}
        changeErrors={setErrorNotification}
      />
    </div>
  );
};
