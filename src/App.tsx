/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header/Header';
import { Todo } from './types/Todo';
import { USER_ID, deleteTodo, getTodos } from './api/todos';
import { Filter, Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorMessage } from './components/Error/Error';
import { TodoItem } from './components/Todo/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterBy, setFilterBy] = useState<Filter>(Filter.all);
  const [selectedTodoId, setSelectedTodoId] = useState(0);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const filteredTodos = useMemo(() => (
    todos.filter(todo => {
      switch (filterBy) {
        case Filter.active:
          return !todo.completed;
        case Filter.completed:
          return todo.completed;
        default:
          return true;
      }
    })
  ), [filterBy, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function onDelete(todoId: number) {
    deleteTodo(todoId)
      .then(() => setTodos((current: Todo[]) => current
        .filter(todo => todo.id !== todoId)))
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
        />

        {todos.length !== 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              selectedTodoId={selectedTodoId}
              setSelectedTodoId={setSelectedTodoId}
              handleDeleteButtonClick={(id) => onDelete(id)}
            />
            {tempTodo && (
              <TodoItem
                todo={tempTodo}
                selectedTodoId={selectedTodoId}
                setSelectedTodoId={setSelectedTodoId}
                isTodoLoading={tempTodo !== null}
                handleDeleteButtonClick={id => onDelete(id)}
              />
            )}

            <Footer
              todos={todos}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              onDelete={id => onDelete(id)}
            />
          </>
        )}
      </div>
      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
