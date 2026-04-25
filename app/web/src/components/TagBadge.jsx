import React from 'react';
import { Badge } from '@/components/ui/badge';

const TagBadge = ({ tag }) => {
  return (
    <Badge variant="secondary" className="text-xs">
      {tag}
    </Badge>
  );
};

export default TagBadge;