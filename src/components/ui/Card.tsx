import type { ReactNode } from 'react';

interface CardProps {
  title: string;
  value: string | number;
  children?: ReactNode;
}

function Card({ title, value, children }: CardProps) {
  return (
    <div className="card h-100 border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <p className="text-muted small mb-1">{title}</p>
            <h3 className="h5 mb-0">{value}</h3>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Card;
