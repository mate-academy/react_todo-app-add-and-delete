import { useContext } from 'react';
import { Error } from './Error';
import { Footer } from './Footer';
import { Form } from './Form';
import { TodoList } from './TodoList';
import { TodoContext } from '../providers/TodoProvider';
import { FormContext } from '../providers/FormProvider';
import { TodoItem } from './TodoItem';

export const TodoApp = () => {
  const { todos } = useContext(TodoContext);
  const { preparingTodoLabel, isCreating } = useContext(FormContext);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Form />
        {todos.length !== 0 && (
          <>
            <TodoList />
            {isCreating && (
              <TodoItem todo={{
                id: 0,
                userId: 11810,
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
