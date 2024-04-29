import { ITags } from "@/@types/tags";
import { api } from "@/lib/axios";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { TagsFields } from "@/components/TagFields";

export interface CreateTaskProps {
  onSave: () => void;
  closeModal: () => void;
}

export function CreateTask({ onSave, closeModal }: CreateTaskProps) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<ITags[]>([]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const formattedObject = {
      title: title,
      description: description,
      dueAt: `${selectedDate}T${selectedTime}:00`,
      durationMinutes: parseInt(selectedDuration),
      tags: selectedTags,
    };

    if (isValidForm()) {
      api.post("/tasks", formattedObject).then(() => {
        toast.success("Atividade criada com sucesso!", {
          position: "bottom-right",
        });

        onSave();
        closeModal();
      });
    }
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
          className="absolute top-0 right-0 m-2  text-slate-400"
          onClick={closeModal}
        >
          Fechar
        </button>

        <form className="w-full" onSubmit={handleSubmit}>
          <h1 className="text-slate-600 text-xl mb-4 font-bold">
            Cadastre uma tarefa
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
                    setSelectedDuration(e.target.value);
                  }}
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

          <div className="w-full flex items-center justify-center pt-4">
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
    </div>
  );
}
