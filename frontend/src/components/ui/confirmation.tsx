"use client";

import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "./dialog";
import { Button, buttonVariants } from "./button";
import { VariantProps } from "class-variance-authority";
type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
type ConfirmationData = {
  title?: string;
  description?: string;
  body?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: ButtonVariant;
  cancelVariant?: ButtonVariant;
};
type ConfirmationDataWithCallbacks = ConfirmationData & {
  onConfirm: () => void;
  onCancel: () => void;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};
type ConfirmationDataWithSetter = (ConfirmationDataWithCallbacks | {}) & {
  setData: React.Dispatch<
    React.SetStateAction<ConfirmationDataWithCallbacks | null>
  >;
};

const confirmContext = React.createContext<ConfirmationDataWithSetter | null>(
  null
);
export const ConfirmContext = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<ConfirmationDataWithCallbacks | null>(null);
  return (
    <confirmContext.Provider value={{ ...data, setData }}>
      {children}
      <ConfirmModal {...data} isOpen={!!data} />
    </confirmContext.Provider>
  );
};

type ConfirmModalProps = Partial<ConfirmationDataWithCallbacks> & {
  title?: string;
  isOpen: boolean;
};

export const ConfirmModal = ({
  confirmText = "OK",
  cancelText = "Cancel",
  title = "Are you sure?",
  confirmVariant,
  cancelVariant,
  ...props
}: ConfirmModalProps) => {
  return (
    <Dialog
      open={props.isOpen}
      onOpenChange={(open) => {
        if (!open) props.onCancel?.();
      }}
    >
      <DialogContent>
        <DialogHeader>{title}</DialogHeader>
        {props.description && (
          <DialogDescription>{props.description}</DialogDescription>
        )}
        <div className="flex flex-column gap-8">
          {props.body}
          <div className="flex flex-row gap-4 w-full justify-between">
            <Button variant={cancelVariant} onClick={props.onCancel}>
              {cancelText}
            </Button>
            <Button variant={confirmVariant} onClick={props.onConfirm}>
              {confirmText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

type UseConfirmResult<T extends Partial<ConfirmationData>> = {
  open: (
    dialogData?: SkipExistingFields<T, ConfirmationData>
  ) => Promise<boolean>;
};

const useConfirmContext = () => {
  const ctx = useContext(confirmContext);
  if (!ctx) throw new Error("ConfirmContext not found");
  return ctx;
};

type SkipExistingFields<T, U> = {
  [K in Exclude<keyof T, keyof U>]: T[K];
};

export const useConfirm = <T extends Partial<ConfirmationData>>(
  baseData?: T
): UseConfirmResult<T> => {
  const data = useConfirmContext();

  return {
    open: (dialogData) => {
      const promise = new Promise<boolean>((resolve) => {
        data.setData({
          ...(baseData as ConfirmationData),
          ...dialogData,
          isOpen: true,
          setIsOpen: (open) => {
            if (!open) {
              data.setData(null);
              resolve(false);
            }
          },
          onConfirm: () => {
            data.setData(null);
            resolve(true);
          },
          onCancel: () => {
            data.setData(null);
            resolve(false);
          },
        });
      });
      return promise;
    },
  };
};
