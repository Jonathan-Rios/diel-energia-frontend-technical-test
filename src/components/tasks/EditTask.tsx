import { ITask } from "@/@types/tasks";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/axios";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ConfirmationDeleteDialog } from "@/components/ConfirmationDeleteDialog";

import { TagsFields } from "@/components/TagFields";
import { ITags } from "@/@types/tags";

interface IResponse {
  task: ITask;
}

export interface CreateTaskProps {
  id: string;
  onEdit: () => void;
  closeModal: () => void;
}

export function EditTask({ id, closeModal, onEdit }: CreateTaskProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const { response } = useFetch<IResponse>(`/tasks/${id}`);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<ITags[]>([]);

  useEffect(() => {
    const task = response?.task;

    if (task?.id) {
      setTitle(task.title || "");
      setDescription(task.description || "");

      if (task.dueAt) {
        const dateObject = new Date(task.dueAt);
        const selectedDate = dateObject.toISOString().split("T")[0];

        const selectedTime = dateObject.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });

        setSelectedDate(selectedDate);
        setSelectedTime(selectedTime);
      }

      setSelectedTags(task.tags || []);
      setSelectedDuration(task.durationMinutes || 0);
    }
  }, [response?.task]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const dateObject = new Date(`${selectedDate}T${selectedTime}:00`);

    const formattedObject = {
      title: title,
      description: description,
      dueAt: dateObject.toISOString(),
      durationMinutes: selectedDuration,
      tags: selectedTags,
    };

    if (isValidForm()) {
      api.patch(`/tasks/${id}`, formattedObject).then(() => {
        toast.success("Atividade atualizada com sucesso!", {
          position: "bottom-right",
        });

        onEdit();
        closeModal();
      });
    }
  }

  function handleDeleteTask() {
    api.delete(`/tasks/${id}`).then(() => {
      toast.success("Atividade removida com sucesso!", {
        position: "bottom-right",
      });

      onEdit();
      closeModal();
    });
  }

  function isValidForm() {
    let isValid = true;

    if (!title) {
      toast.error("Título não informado!", {
        position: "bottom-right",
      });
      isValid = false;
    }
    if (!description) {
      toast.error("Descrição não informada!", {
        position: "bottom-right",
      });
      isValid = false;
    }
    if (!selectedDate) {
      toast.error("Data não informada!", {
        position: "bottom-right",
      });
      isValid = false;
    }
    if (!selectedTime) {
      toast.error("Hora não informada!", {
        position: "bottom-right",
      });
      isValid = false;
    }

    if (!selectedDuration) {
      toast.error("Duração não informada!", {
        position: "bottom-right",
      });
      isValid = false;
    }

    return isValid;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-md shadow-lg relative min-w-[600px] min-h-[400px]">
        <button
          className="absolute top-2 right-4 m-2  text-slate-400"
          onClick={closeModal}
        >
          Fechar
        </button>

        <form className="w-full" onSubmit={handleSubmit}>
          <h1 className="text-slate-600 text-xl mb-4 font-bold">
            Edite uma tarefa
          </h1>

          <div className="flex flex-col gap-4">
            <div className="w-full">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Título
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="text"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                value={title}
              />
            </div>
            <div className="w-full">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Descrição
              </label>
              <textarea
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                value={description}
              />
            </div>

            <div className="flex gap-4">
              <div className="w-full">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="data"
                >
                  Data:
                </label>
                <input
                  type="date"
                  id="data"
                  name="data"
                  className="appearance-none block w-full bg-gray-200  text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                  }}
                  value={selectedDate}
                />
              </div>

              <div className="w-full">
                <label
                  className="appearance-none block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="hora"
                >
                  Hora:
                </label>
                <input
                  type="time"
                  id="hora"
                  name="hora"
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  onChange={(e) => {
                    setSelectedTime(e.target.value);
                  }}
                  value={selectedTime}
                />
              </div>
            </div>

            <div className="w-full">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Duração
              </label>
              <div className="relative">
                <select
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-state"
                  onChange={(e) => {
                    setSelectedDuration(parseInt(e.target.value));
                  }}
                  value={selectedDuration}
                >
                  <option value={0}>Selecione uma duração</option>
                  <option value={15}>15 Minutos</option>
                  <option value={30}>30 Minutos</option>
                  <option value={45}>45 Minutos</option>
                  <option value={60}>60 Minutos</option>
                </select>
              </div>
            </div>

            <TagsFields
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
          </div>

          <div className="w-full flex items-center justify-around pt-4">
            <button
              type="button"
              className={
                "rounded-[4px] py-1 p-8 font-bold bg-red-500 text-white w-40 h-10 "
              }
              onClick={() => setShowDeleteDialog(true)}
            >
              Excluir
            </button>

            <button
              type="submit"
              className={
                "rounded-[4px] py-1 p-8 font-bold bg-cyan-600 text-white w-40 h-10 "
              }
            >
              Salvar
            </button>
          </div>
        </form>
      </div>

      {showDeleteDialog && (
        <ConfirmationDeleteDialog
          onDelete={handleDeleteTask}
          onClose={() => setShowDeleteDialog(false)}
        />
      )}
    </div>
  );
}
