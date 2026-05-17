import React from 'react';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from './shadcn/AlertDialog';
import { useUiStore } from '@/store/uiStore';

export const ConfirmDialog: React.FC = () => {
  const { confirm, resolveConfirm } = useUiStore();
  return (
    <AlertDialog open={confirm.open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认操作</AlertDialogTitle>
          <AlertDialogDescription>{confirm.message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => resolveConfirm(false)}>取消</AlertDialogCancel>
          <AlertDialogAction onClick={() => resolveConfirm(true)}>{confirm.confirmText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
