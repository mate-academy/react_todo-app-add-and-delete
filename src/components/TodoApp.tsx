import { useContext } from 'react';

import { Error } from './TodoError';
import { Footer } from './Footer';
import { TodoForm } from './TodoForm';
import { TodoList } from './TodoList';
import { TodoContext } from '../contexts/TodoContext';
import { FormContext } from '../contexts/FormContext';
import { TodoItem } from './TodoItem';

export const TodoApp = () => {
  const { todos } = useContext(TodoContext);
  const { preparingTodoLabel, isCreating } = useContext(FormContext);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm />
        {todos.length !== 0 && (
          <>
            <TodoList />
            {isCreating && (
              <TodoItem todo={{
                id: 0,
                userId: 11877,
                title: preparingTodoLabel,
                completed: false,
              }}
              />
            )}
            <Footer />
          </>
        )}
      </div>

      <Error />
    </div>
  );
};
