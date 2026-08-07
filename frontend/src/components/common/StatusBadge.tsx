import React from 'react';
import { ProductStatus } from '../../types';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface StatusBadgeProps {
  status: ProductStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'IN_STOCK':
      return (
        <Badge variant="success" size="sm">
          <CheckCircle2 className="h-3 w-3" />
          In Stock
        </Badge>
      );
    case 'LOW_STOCK':
      return (
        <Badge variant="warning" size="sm">
          <AlertTriangle className="h-3 w-3" />
          Low Stock
        </Badge>
      );
    case 'OUT_OF_STOCK':
      return (
        <Badge variant="danger" size="sm">
          <XCircle className="h-3 w-3" />
          Out of Stock
        </Badge>
      );
    default:
      return null;
  }
};
