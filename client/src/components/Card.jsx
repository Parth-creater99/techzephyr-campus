import React from 'react';

/**
 * Reusable Card container and compound subcomponents.
 */
export function Card({
  children,
  elevated = false,
  hoverable = false,
  className = '',
  ...props
}) {
  const classes = [
    'card',
    elevated ? 'card-elevated' : '',
    hoverable ? 'card-hoverable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`card-header ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function CardTitleGroup({ children, className = '', ...props }) {
  return (
    <div className={`card-title-group ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, as: Tag = 'h3', className = '', ...props }) {
  return (
    <Tag className={`card-title ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p className={`card-description ${className}`.trim()} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={`card-content ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={`card-footer ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export default Card;
