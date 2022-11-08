/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';

import { getTodos, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodosList } from './components/TodosList';
import { FilterBy } from './types/FilterBy';
import { Footer } from './components/Footer';
import { TodoAdd } from './components/TodoAdd';
import { TodoAddCard } from './components/TodoAddCard';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  // Add new Todo
  const [todosList, setTodoList] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  // Errors
  const [titleError, setTitleError] = useState(false);
  const [addingError, setAddingError] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [updateError, setUpdateError] = useState(false);

  // states
  const [isAdding, setIsAdding] = useState(false);
  const [deleteAll, setDeleteAll] = useState(false);

  // Filter By
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);

  const leftTodos = todosList.filter(todo => todo.completed === false).length;
  const completedTodos = todosList.length - leftTodos;

  const filteredTodos = todosList.filter(todo => {
    switch (filterBy) {
      case FilterBy.Active:
        return todo.completed === false;
      case FilterBy.Completed:
        return todo.completed === true;
      case FilterBy.All:
      default:
        return true;
    }
  });

  const getTodosList = async () => {
    if (user) {
      setTodoList(await getTodos(user.id));
    }
  };

  const handlerFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsAdding(true);

    const normilizedTodoTitle = newTodoTitle
      .trim()
      .split(' ')
      .filter(words => words !== '')
      .join(' ');

    if (!newTodoTitle) {
      setTitleError(true);
      setTimeout(() => {
        setTitleError(false);
      }, 3000);
      setNewTodoTitle('');
      setIsAdding(false);

      return;
    }

    if (user && !titleError) {
      try {
        const newTodo = await addTodo(user.id, normilizedTodoTitle);

        setTodoList(currentList => [...currentList, newTodo]);
      } catch {
        setAddingError(true);
        setTimeout(() => {
          setAddingError(false);
        }, 3000);
      }
    }

    setNewTodoTitle('');
    setIsAdding(false);
  };

  const handlerInputTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
    setTitleError(false);
  };

  const ClearError = () => {
    setDeleteError(false);
    setUpdateError(false);
    setTitleError(false);
  };

  const deleteAllCompleted = async () => {
    setDeleteAll(true);
    try {
      await Promise.all(todosList.map(todo => {
        if (todo.completed) {
          return deleteTodo(todo.id);
        }

        return null;
      }));

      setTodoList(currentList => currentList
        .filter(todo => !todo.completed));
    } catch {
      setDeleteError(true);
      setTimeout(() => {
        setDeleteError(false);
      }, 3000);
    }

    setDeleteAll(false);
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosList();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <TodoAdd
            newTodoField={newTodoField}
            newTodoTitle={newTodoTitle}
            handlerFormSubmit={handlerFormSubmit}
            handlerInputTitle={handlerInputTitle}
            isAdding={isAdding}
          />
        </header>

        {todosList.length > 0
          && (
            <TodosList
              todos={filteredTodos}
              setTodosList={setTodoList}
              setDeleteError={setDeleteError}
              deleteAll={deleteAll}
            />
          )}

        {isAdding && (
          <TodoAddCard
            todo={{
              id: 0,
              title: newTodoTitle,
              completed: false,
              userId: user ? user.id : 0,
            }}
            isLoading={isAdding}
          />
        )}

        {todosList.length > 0
          && (
            <Footer
              leftTodos={leftTodos}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              completedTodos={completedTodos}
              deleteAllCompleted={deleteAllCompleted}
            />
          )}
      </div>

      {(titleError || deleteError || updateError || addingError) && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={ClearError}
          />

          {titleError && ('Title can\'t be empty')}

          {addingError && <br /> && ('Unable to add a todo')}

          {deleteError && <br /> && 'Unable to delete a todo'}

          {updateError && <br /> && 'Unable to update a todo'}
        </div>
      )}
    </div>
  );
};
