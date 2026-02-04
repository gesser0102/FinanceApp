import * as DialogPrimitive from '@radix-ui/react-dialog';
import { AlertTriangle, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  variant = 'danger',
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const variantStyles = {
    danger: {
      icon: 'text-danger-400',
      iconBg: 'bg-danger-500/20 ring-2 ring-danger-500/30',
      button: 'danger' as const,
    },
    warning: {
      icon: 'text-amber-400',
      iconBg: 'bg-amber-500/20 ring-2 ring-amber-500/30',
      button: 'primary' as const,
    },
    info: {
      icon: 'text-primary-400',
      iconBg: 'bg-primary-500/20 ring-2 ring-primary-500/30',
      button: 'primary' as const,
    },
  };

  const style = variantStyles[variant];

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-dark-900 shadow-2xl shadow-black/60 border border-dark-800 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] z-50">
          <div className="p-6">
            <DialogPrimitive.Close className="absolute right-4 top-4 text-dark-400 transition-colors hover:text-dark-200">
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>

            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 p-3 rounded-full ${style.iconBg}`}>
                <AlertTriangle className={`h-6 w-6 ${style.icon}`} />
              </div>
              <div className="flex-1 pt-1">
                <DialogPrimitive.Title className="text-xl font-semibold text-dark-50 mb-2">
                  {title}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="text-dark-300 text-sm leading-relaxed">
                  {description}
                </DialogPrimitive.Description>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                {cancelText}
              </Button>
              <Button
                type="button"
                variant={style.button}
                onClick={handleConfirm}
                className="flex-1"
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
