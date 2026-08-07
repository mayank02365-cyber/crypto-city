import React from 'react';

export interface MotionDivProps extends React.HTMLAttributes<HTMLDivElement> {
  initial?: any;
  animate?: any;
  transition?: any;
  exit?: any;
}

export const motion = {
  div: React.forwardRef<HTMLDivElement, MotionDivProps>(({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`transition-all duration-300 ease-out ${className}`} {...props}>
      {children}
    </div>
  )),
  aside: React.forwardRef<HTMLElement, any>(({ children, className = '', style, animate, ...props }, ref) => (
    <aside
      ref={ref}
      className={`transition-all duration-300 ease-out ${className}`}
      style={{
        ...style,
        width: animate?.width !== undefined ? animate.width : style?.width,
      }}
      {...props}
    >
      {children}
    </aside>
  )),
};

export const AnimatePresence: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
