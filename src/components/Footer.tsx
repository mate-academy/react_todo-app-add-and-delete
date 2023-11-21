type Props = {
  children: React.ReactNode;
};

export const Footer: React.FC<Props> = ({ children }) => (
  <footer className="todoapp__footer" data-cy="Footer">
    {children}
  </footer>
);
