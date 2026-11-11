import { useEffect, useRef } from "react";
import Button from "./Button";

function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
  isPending = false,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    dialog?.showModal();

    return () => {
      dialog?.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        if (isPending) {
          e.preventDefault();
        } else {
          onCancel();
        }
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-xl backdrop:bg-slate-900/50"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      <h2 id="confirm-dialog-title" className="text-lg font-semibold">
        {title}
      </h2>

      <p id="confirm-dialog-message" className="mt-3 text-sm text-slate-600">
        {message}
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={isPending}
          autoFocus
        >
          Cancel
        </Button>

        <Button variant="danger" onClick={onConfirm} disabled={isPending}>
          {isPending ? "Deleting..." : "Delete expense"}
        </Button>
      </div>
    </dialog>
  );
}

export default ConfirmDialog;
