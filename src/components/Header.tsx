type Props = {
  children: React.ReactNode;
};

export const Header: React.FC<Props> = ({ children }) => (
  <header className="todoapp__header">
    {children}
  </header>
);
