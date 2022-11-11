/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { AuthProvider, AuthContext } from './components/Auth/AuthContext';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorEnums } from './enums/ErrorEnums';
import { Error } from './components/Error';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList';
import { FilterProvider } from './components/FilterContext';
import { TempTodo } from './components/TempTodo'

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState< Todo[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [error, setError] = useState<ErrorEnums>(ErrorEnums.None);


  const loadTodos = async () => {
    if (user?.id) {
      let todosFromServer;

      try {
        todosFromServer = await getTodos(user.id);
      } catch {
        throw Error('Todos not found');
      }

      setTodos(todosFromServer);
    }
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadTodos();
  }, []);

  const addNewTodo = async (
    title: string,

  ) => {

    if (user && title.trim()) {
      setIsAdding(true);

      const getNewTodo = {
        userId: user.id,
        title: title.trim(),
        completed: false,
      };

      try {
        await addTodo(getNewTodo);
        
      } catch {
        setError(ErrorEnums.Add);
      }
    }

    await loadTodos();
    setNewTodoTitle('');
    setIsAdding(false);
  }

  const handleDeleteTodo =  async (id: number) => {
    try {
      await deleteTodo(id)
    } catch {
      setError(ErrorEnums.Delete)
    }
    await loadTodos();
  }

  const deleteCompletedTodos = () => {
    const completedTodos = todos.filter (({completed}) => completed)
    .map(({id}) => id);
  
    todos.forEach(todo => { if (completedTodos.includes(todo.id)) {
      handleDeleteTodo(todo.id)
    } })
  }

  const resetForm = () => {
    setNewTodoTitle('');

  };

  const handleError = (errorType: ErrorEnums) => {
    setError(errorType);
    console.log(errorType)
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (newTodoTitle) {
      addNewTodo(newTodoTitle);
      resetForm();
    }
  };

  return (
    <AuthProvider>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <header className="todoapp__header">
            {todos.length > 0 && (
              <button
                data-cy="ToggleAllButton"
                type="button"
                className="todoapp__toggle-all active"
              />
            )}

            <form onSubmit={handleFormSubmit}>
              <input
                data-cy="NewTodoField"
                type="text"
                ref={newTodoField}
                className="todoapp__new-todo"
                placeholder="What needs to be done?"
                value={newTodoTitle}
                onChange={(event) => setNewTodoTitle(event.target.value)}
              />
            </form>
          </header>

          {isAdding && (
            <TempTodo title={newTodoTitle} />
          )}

          <FilterProvider>
            <TodoList
              todos={todos}
              deleteTodo={handleDeleteTodo}
              onError={handleError}
            />

            {todos.length > 0 && (
              <Footer
                todos={todos}
                deleteCompletedTodos={deleteCompletedTodos}
              />
            )}
          </FilterProvider>
        </div>

        <Error 
          error={error}
          setError={setError}
        />
      </div>
    </AuthProvider>
  );
};
