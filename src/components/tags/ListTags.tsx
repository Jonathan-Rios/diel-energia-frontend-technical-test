import { ITags } from "@/@types/tags";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/axios";
import { Trash2, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { ConfirmationDeleteDialog } from "@/components/ConfirmationDeleteDialog";
import { CreateTag } from "./CreateTag";
import { EditTag } from "./EditTag";

interface IResponse {
  tags: ITags[];
}

export interface ListTagsProps {
  closeModal: () => void;
}

export function ListTags({ closeModal }: ListTagsProps) {
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] =
    useState<boolean>(false);
  const [isEditDialogVisible, setIsEditDialogVisible] =
    useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<ITags>();

  const [createIsTagsModalVisible, setIsCreateTagsModalVisible] =
    useState<boolean>(false);

  const { response, reloadData } = useFetch<IResponse>("/tags");
  const tags = response?.tags || [];

  function handleDelete(id: string) {
    api.delete(`/tags/${id}`).then(() => {
      toast.success("Tag removida com sucesso!", {
        position: "bottom-right",
      });

      setIsDeleteDialogVisible(false);
      reloadData();
    });
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white px-4  py-8 rounded-md shadow-lg relative min-w-[600px]">
        <button
          className="absolute top-2 right-4 m-2  text-slate-400"
          onClick={closeModal}
        >
          Fechar
        </button>

        <div className="flex flex-col gap-4">
          <h1 className="text-slate-600 text-xl mb-4 font-bold">
            Lista de Tags
          </h1>

          {tags?.length ? (
            <div className="grid grid-cols-3 gap-4">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="bg-white p-4 rounded-md shadow-md flex flex-col"
                  style={{ backgroundColor: tag.color }}
                >
                  <p className="bg-white rounded-[4px] px-2 text-gray-1200 text-slate-800">
                    {tag.name}
                  </p>

                  <div className="flex justify-between w-full mt-4">
                    <button
                      className="flex border rounded-md border-red-50 bg-red-600 w-8 h-8 items-center justify-center"
                      onClick={() => {
                        setSelectedTag(tag);
                        setIsDeleteDialogVisible(true);
                      }}
                    >
                      <Trash2 className="text-red-50" size={20} />
                    </button>
                    <button
                      className="flex border rounded-md border-cyan-200 bg-cyan-600 w-8 h-8 items-center justify-center"
                      onClick={() => {
                        setSelectedTag(tag);
                        setIsEditDialogVisible(true);
                      }}
                    >
                      <Pencil className="text-cyan-50" size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <h2 className="text-md text-slate-500 mx-auto mb-4">
              Ainda não possui nenhuma tag, crie uma!
            </h2>
          )}

          <button
            className={
              "rounded-[4px] py-2 p-8 font-bold bg-cyan-600 text-white"
            }
            onClick={() => setIsCreateTagsModalVisible(true)}
          >
            Criar nova Tag
          </button>
        </div>
      </div>

      {createIsTagsModalVisible && (
        <CreateTag
          onSave={reloadData}
          closeModal={() => setIsCreateTagsModalVisible(false)}
        />
      )}

      {isEditDialogVisible && (
        <EditTag
          tag={selectedTag!}
          onSave={reloadData}
          closeModal={() => setIsEditDialogVisible(false)}
        />
      )}

      {isDeleteDialogVisible && (
        <ConfirmationDeleteDialog
          onDelete={() => handleDelete(selectedTag!.id)}
          onClose={() => setIsDeleteDialogVisible(false)}
        />
      )}
    </div>
  );
}
