export interface ConfirmationDeleteDialogProps {
  onDelete: () => void;
  onClose: () => void;
}

export function ConfirmationDeleteDialog({
  onDelete,
  onClose,
}: ConfirmationDeleteDialogProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg w-[300px]">
        <p className="text-lg mb-4 text-slate-800">
          Tem certeza que deseja excluir?
        </p>
        <div className="flex justify-end">
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mr-2"
          >
            Excluir
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
