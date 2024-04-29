import { api } from "@/lib/axios";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

export interface CreateTagProps {
  onSave: () => void;
  closeModal: () => void;
}

export function CreateTag({ closeModal, onSave }: CreateTagProps) {
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("#FF9000");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (isValidForm()) {
      api.post("/tags", { name, color }).then(() => {
        toast.success("Tag criada com sucesso!", {
          position: "bottom-right",
        });

        onSave();
        closeModal();
      });
    }
  }

  function isValidForm() {
    let isValid = true;

    if (!name) {
      toast.error("Nome da tag não informado!", {
        position: "bottom-right",
      });
      isValid = false;
    }

    if (!color) {
      toast.error("Cor da tag não informada!", {
        position: "bottom-right",
      });
      isValid = false;
    }

    return isValid;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-md shadow-lg relative min-w-[500px]">
        <button
          className="absolute top-2 right-4 m-2  text-slate-400"
          onClick={closeModal}
        >
          Fechar
        </button>

        <form className="w-full" onSubmit={handleSubmit}>
          <h1 className="text-slate-600 text-xl mb-4 font-bold">
            Cadastre uma tag
          </h1>

          <div className="flex gap-4">
            <div className="w-full">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="name"
              >
                Nome da Tag
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
                maxLength={50}
              />
            </div>
            <div>
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="name"
              >
                Selecione a cor
              </label>
              <input
                className="w-40 h-12"
                type="color"
                name="myColor"
                value={color}
                onChange={(e) => {
                  setColor(e.target.value);
                }}
              />
            </div>
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
