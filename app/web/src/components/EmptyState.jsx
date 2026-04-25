import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const EmptyState = ({ icon: Icon, title, description, actionLabel, actionPath }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && <Icon className="h-16 w-16 text-muted-foreground mb-4" />}
      <h3 className="text-xl font-semibold mb-2" style={{ textWrap: 'balance' }}>{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {actionLabel && actionPath && (
        <Link to={actionPath}>
          <Button>{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;