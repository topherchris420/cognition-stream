import React from 'react';

// Recursively clone React elements and strip any props that could be injected by
// the lovable componentTagger that break react-three-fiber (e.g., data tags or
// internal markers). We keep DOM UI outside R3F untouched; this only wraps the
// Canvas subtree.

const shouldStripKey = (key: string) => {
  const k = key.toLowerCase();
  return (
    // generic catch for any plugin-specific markers
    k.includes('lov') ||
    k.includes('lovable') ||
    k === 'data-component-id' ||
    k.startsWith('data-lov') ||
    k.startsWith('__lov')
  );
};

function sanitizeNode(node: React.ReactNode): React.ReactNode {
  if (Array.isArray(node)) return node.map(sanitizeNode);
  if (!React.isValidElement(node)) return node;

  // Sanitize children first
  const sanitizedChildren = React.Children.map(node.props.children, sanitizeNode);

  // Strip unsafe props
  const newProps: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(node.props)) {
    if (key === 'children') continue;
    if (typeof key === 'string' && shouldStripKey(key)) continue;
    newProps[key] = value;
  }

  return React.cloneElement(node, newProps, sanitizedChildren);
}

export const SanitizeR3F: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <>{sanitizeNode(children)}</>;
};

export default SanitizeR3F;
