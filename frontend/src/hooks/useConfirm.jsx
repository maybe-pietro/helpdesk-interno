import { useCallback, useState } from 'react';
import ConfirmDialogModal from '../components/ui/ConfirmDialog';

// Promise-based confirm() to replace window.confirm with a styled modal.
// Usage: const { confirm, ConfirmDialog } = useConfirm();
//        if (await confirm('Remover isto?')) { ... }
//        return (<>{ConfirmDialog}...</>)
export function useConfirm() {
  const [pending, setPending] = useState(null); // { message, resolve }

  const confirm = useCallback((message) => new Promise((resolve) => {
    setPending({ message, resolve });
  }), []);

  const resolve = (result) => {
    pending?.resolve(result);
    setPending(null);
  };

  const ConfirmDialog = pending ? (
    <ConfirmDialogModal
      message={pending.message}
      onConfirm={() => resolve(true)}
      onCancel={() => resolve(false)}
    />
  ) : null;

  return { confirm, ConfirmDialog };
}
