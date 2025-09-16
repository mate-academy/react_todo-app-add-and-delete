import React, { useCallback, useEffect, useState } from 'react';
import { Header } from './components/Header';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { getTodos, addTodo, USER_ID } from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // ⬇️ linha em branco exigida antes de blocos/estatements
  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      try {
        const data = await getTodos();

        if (!ignore) {
          setTodos(data);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    load();

    // ⬇️ linha em branco antes do return (regra do ESLint)
    return () => {
      ignore = true;
    };
  }, []);

  // ⬇️ linha em branco entre o useEffect e a próxima declaração
  const handleSubmit = useCallback(
    async (
      event: React.FormEvent<HTMLFormElement>,
      inputRef: React.RefObject<HTMLInputElement>,
    ) => {
      event.preventDefault();

      const title = inputRef.current?.value.trim() ?? '';

      // ⬇️ linha em branco antes de qualquer return
      if (!title) {
        return;
      }

      setLoading(true);
      try {
        const created = await addTodo({
          title,
          completed: false,
          userId: USER_ID,
        } as unknown as Todo);

        setTodos(prev => [created, ...prev]);
        setQuery(''); // input controlado limpa sozinho
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ⬇️ linha em branco antes do return também ajuda a evitar reclamação
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <section className="todoapp">
      <div className="todoapp__content">
        <Header
          onSubmit={handleSubmit}
          query={query}
          onQuery={setQuery}
          todos={todos}
          loading={loading}
        />
        {/* Lista e Footer entram depois */}
      </div>
    </section>
  );
};
