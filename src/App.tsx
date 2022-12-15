/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { NewTodo } from './components/NewTodo';
import { ErrorNotification } from './components/ErrorNotifications';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Filter } from './types/Filter';
import { Notifications } from './types/Notifications';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [notification, setNotification]
   = useState<Notifications>(Notifications.None);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos]);

  const fetchTodos = async () => {
    if (user) {
      try {
        const receivedTodos = await getTodos(user.id);

        setTodos(receivedTodos);
      } catch (error) {
        setNotification(Notifications.Load);

        setTimeout(() => {
          setNotification(Notifications.None);
        }, 3000);
      }
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [todos]);

  const filterTodos = (filterType: Filter) => {
    switch (filterType) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);

      case Filter.Completed:
        return todos.filter(todo => todo.completed);

      case Filter.All:
      default:
        return todos;
    }
  };

  const filteredTodos = filterTodos(filter);
  const activeTodos = filterTodos(Filter.Active);
  const completedTodos = filterTodos(Filter.Completed);

  const addNewTodo = async (newTitle: string) => {
    if (user) {
      try {
        setIsAdding(true);

        const newTodo = await addTodo({
          title: newTitle,
          userId: user.id,
          completed: false,
        });

        setIsAdding(false);
        setTodos(visibleTodos => [...visibleTodos, newTodo]);
      } catch (error) {
        setNotification(Notifications.Add);
        setTitle('');
        setIsAdding(false);

        setTimeout(() => {
          setNotification(Notifications.None);
        }, 3000);
      }
    }
  };

  const deleteCompletedTodos = async () => {
    setIsAdding(true);

    try {
      await Promise.all(completedTodos.map(async todo => {
        await deleteTodo(todo.id);
      }));
      fetchTodos();
    } catch (error) {
      setNotification(Notifications.Delete);
    }

    setIsAdding(false);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!filteredTodos.length && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                { active: activeTodos.length === 0 },
              )}
            />
          )}
          <NewTodo
            newTodoField={newTodoField}
            title={title}
            setTitle={setTitle}
            addNewTodo={addNewTodo}
            isAdding={isAdding}
            setNotification={setNotification}
          />
        </header>

        {!!todos.length && (
          <>
            <TodoList
              todos={filteredTodos}
              setNotification={setNotification}
            />
            <Footer
              filter={filter}
              setFilter={setFilter}
              activeTodos={activeTodos}
              completedTodos={completedTodos}
              deleteCompletedTodos={deleteCompletedTodos}
            />
          </>
        )}
      </div>
      {notification && (
        <ErrorNotification
          notification={notification}
          resetNotification={() => setNotification(Notifications.None)}
        />
      )}
    </div>
  );
};
