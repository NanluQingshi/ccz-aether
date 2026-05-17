import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cn } from '@/lib/utils';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex items-center justify-between w-full rounded-lg border border-[#1e293b] bg-[#1f2937]',
      'px-3 py-2 text-sm text-[#e2e8f0] outline-none',
      'hover:border-[#00f5ff]/40 focus:border-[#00f5ff] focus:ring-2 focus:ring-[#00f5ff]/15',
      'disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
      '[&>span]:truncate',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-60 shrink-0 ml-1">
        <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-[2000] min-w-[8rem] overflow-hidden rounded-xl border border-[#1e293b] bg-[#111827] shadow-xl',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        position === 'popper' && 'data-[side=bottom]:translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className={cn('p-1', position === 'popper' && 'w-full')}>
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('px-3 py-1.5 text-xs text-[#64748b] font-medium', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex items-center rounded-lg px-3 py-2 text-sm text-[#94a3b8] outline-none cursor-pointer select-none',
      'hover:bg-[#1f2937] hover:text-[#e2e8f0]',
      'focus:bg-[#1f2937] focus:text-[#e2e8f0]',
      'data-[state=checked]:text-[#00f5ff] data-[state=checked]:bg-[rgba(0,245,255,0.08)]',
      'data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
      'transition-colors',
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('my-1 h-px bg-[#1e293b]', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select, SelectGroup, SelectValue, SelectTrigger,
  SelectContent, SelectLabel, SelectItem, SelectSeparator,
};
