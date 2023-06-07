/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { NewTodo } from './components/NewTodo/NewTodo';
import { TodoList } from './components/TodoList/TodoList';
import { Notification } from './components/Notification/Notification';
import { Todo } from './types/Todo';
import { FilterTypes } from './types/FilterTypes';
import { Footer } from './components/Footer/Footer';

const USER_ID = 10596;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentTodos, setCurrentTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inputText, setInputText] = useState('');
  const [filterType, setFilterType] = useState<FilterTypes>(FilterTypes.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [needUpdate, setNeedUpdate] = useState(false);

  const handleErrorMessage = (type: string) => {
    setErrorMessage(`Unable to ${type} a Todo`);
  };

  const handleDeleteTodo = (todoId: string) => {
    deleteTodo(todoId)
      .then(() => setNeedUpdate(true))
      .catch(() => handleErrorMessage('delete'));
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((value) => {
        setTodos(value);
        setNeedUpdate(false);
      })
      .catch(() => handleErrorMessage('get'));
  }, [needUpdate]);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage]);

  useEffect(() => {
    switch (filterType) {
      case 'completed': {
        setCurrentTodos(todos.filter((todo) => todo.completed));
        break;
      }

      case 'active': {
        setCurrentTodos(todos.filter((todo) => !todo.completed));
        break;
      }

      default: {
        setCurrentTodos(todos);
      }
    }
  }, [todos, filterType]);

  useEffect(() => {
    if (tempTodo) {
      addTodo(tempTodo)
        .then((thisTodo) => {
          setTodos([...todos, thisTodo]);
          setTempTodo(null);
        })
        .catch(() => {
          handleErrorMessage('add');
          setTempTodo(null);
        });
    }
  }, [tempTodo]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button type="button" className="todoapp__toggle-all active" />

          <NewTodo
            tempTodo={tempTodo}
            userId={USER_ID}
            inputText={inputText}
            onTextChange={setInputText}
            onTodoSubmit={setTempTodo}
            onError={setErrorMessage}
          />
        </header>

        <TodoList
          todos={currentTodos}
          tempTodo={tempTodo}
          onDeleteTodo={handleDeleteTodo}
        />

        {todos.length && (
          <Footer
            allTodos={todos}
            currentTodos={currentTodos}
            currentFilter={filterType}
            onSelectFilter={setFilterType}
          />
        )}
      </div>

      <Notification error={errorMessage} />
    </div>
  );
};
