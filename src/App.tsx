/* eslint-disable import/no-cycle */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Section } from './components/Section';
import { getTodos, createTodos, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { AuthContext } from './components/Auth/AuthContext';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedId, setSelectedId] = useState<number[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    async function todosFromServer() {
      try {
        const visibleTodos = getTodos(user?.id);

        setTodos(await visibleTodos);
      } catch (error) {
        setErrorMessage(`${error}`);
      }
    }

    todosFromServer();
  }, []);

  const filteredTodos = todos?.filter(todoItem => {
    if (filterBy === 'active') {
      return !todoItem.completed;
    }

    if (filterBy === 'completed') {
      return todoItem.completed;
    }

    return todoItem;
  });

  const handleTodos = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title) {
      setErrorMessage('Title can`t be empty');

      return;
    }

    await createTodos(user?.id, title)
      .then(newTodo => {
        setTodos([...todos, newTodo]);
      })
      .catch(() => {
        setErrorMessage('Title can\'t be empty');
      });

    setTitle('');
    setIsAdding(false);
  };

  const removeTodo = async (todoId: number) => {
    setSelectedId([todoId]);
    setIsAdding(true);

    await deleteTodo(todoId)
      .then(() => {
        setIsAdding(false);
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });
  };

  const completedTodos = todos.filter(({ completed }) => completed);

  const handleDeleteCompletedTodos = useCallback(() => {
    setSelectedId([...completedTodos].map(({ id }) => id));

    Promise.all(completedTodos.map(({ id }) => removeTodo(id)))
      .then(() => setTodos([...todos.filter(({ completed }) => !completed)]))
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setSelectedId([]);
      });
  }, [todos, selectedId, errorMessage]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <Header
        newTodoField={newTodoField}
        title={title}
        setTitle={setTitle}
        handleTodos={handleTodos}
      />

      { (isAdding || todos) && (
        <div className="todoapp__content">

          <Section
            filteredTodos={filteredTodos}
            removeTodo={removeTodo}
            isAdding={isAdding}
            selectedId={selectedId}
          />

          <Footer
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            filteredTodos={filteredTodos}
            handleDeleteCompletedTodos={handleDeleteCompletedTodos}
            completedTodos={completedTodos}
          />
        </div>
      )}

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}

    </div>
  );
};
