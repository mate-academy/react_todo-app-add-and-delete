/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { getTodos, addTodo, removeTodo } from './api/todos';

import { AuthContext } from './components/Auth/AuthContext';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';

import { FilterBy } from './types/FilterBy';
import { Todo, TodoToPost } from './types/Todo';
import { User } from './types/User';

export const App: React.FC = () => {
  const user: User | null = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [isSuccessful, setIsSuccessful] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);

  const [isAdding, setIsAdding] = useState(false);

  const getTodosFromApi = async () => {
    try {
      if (user) {
        const todosFromApi = await getTodos(user.id);

        setTodos(todosFromApi);
        setVisibleTodos(todosFromApi);
      }
    } catch (error) {
      setIsSuccessful(false);
      setErrorMessage('Todos could not be loaded. Try reloading the page.');
    }
  };

  const filterTodos = useCallback(() => {
    const newVisibleTodos = todos.filter(({ completed }) => {
      switch (filterBy) {
        case FilterBy.Completed:
          return completed;

        case FilterBy.Active:
          return !completed;

        default:
          return true;
      }
    });

    setVisibleTodos(newVisibleTodos);
  }, [todos, filterBy]);

  const addTodoToServer = async (newTodoTitle: string) => {
    if (user) {
      try {
        setIsAdding(true);

        const todoToAdd: TodoToPost = {
          title: newTodoTitle,
          userId: user.id,
          completed: true,
        };

        const newTodo = await addTodo(todoToAdd);

        setIsAdding(false);

        setTodos(currentTodos => [...currentTodos, newTodo]);
      } catch (error) {
        setIsSuccessful(false);
        setErrorMessage('Todo could not be added. Try again.');
      }
    }
  };

  const removeTodoFromServer = async (todoToRemoveId: number) => {
    try {
      await removeTodo(todoToRemoveId);
      setTodos(currentTodos => (
        currentTodos.filter(todo => todo.id !== todoToRemoveId)
      ));
    } catch (error) {
      setIsSuccessful(false);
      setErrorMessage('Todo could not be deleted. Try again.');
    }
  };

  const removeAllCompletedTodos = async () => {
    try {
      const completedTodos = todos
        .filter(({ completed }) => completed);

      await completedTodos.forEach(({ id }) => removeTodoFromServer(id));
    } catch (error) {
      setIsSuccessful(false);
      setErrorMessage('Completed todos could not be deleted. Try again.');
    }
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosFromApi();
  }, []);

  useEffect(filterTodos, [filterBy, todos]);

  useEffect(() => {
    setTimeout(() => {
      setIsSuccessful(true);
    }, 4000);
  }, [isSuccessful]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          addTodoToServer={addTodoToServer}
          isTodoBeingAdded={isAdding}
          setIsSuccessful={setIsSuccessful}
          setErrorMessage={setErrorMessage}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              removeTodoFromServer={removeTodoFromServer}
            />

            <Footer
              todosLeft={todos.filter(({ completed }) => !completed).length}
              todosDone={todos.filter(({ completed }) => completed).length}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              removeCompletedTodos={removeAllCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorMessage
        isHidden={isSuccessful}
        setIsHidden={setIsSuccessful}
      >
        {errorMessage}
      </ErrorMessage>
    </div>
  );
};
