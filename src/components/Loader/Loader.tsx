import React from 'react';

const LoaderBase: React.FC = () => <div className="loader"></div>;

export const Loader = React.memo(LoaderBase);
