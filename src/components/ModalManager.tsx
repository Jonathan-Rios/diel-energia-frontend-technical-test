import { useState } from "react";
import { ListTags } from "./tags/ListTags";
import { CreateTask } from "./tasks/CreateTask";

export interface ModalManagerProps {
  reloadData: () => void;
}

export function ModalManager({ reloadData }: ModalManagerProps) {
  const [createTaskModalIsVisible, setCreateTaskModalIsVisible] =
    useState<boolean>(false);
  const [listTagsModalIsVisible, setListTagsModalIsVisible] =
    useState<boolean>(false);

  return (
    <div className="flex w-full items-end justify-end ">
      <div className="flex gap-4">
        <button
          className={"rounded-[4px] py-1 p-8 font-bold bg-cyan-600 text-white"}
          onClick={() => setCreateTaskModalIsVisible(true)}
        >
          Criar nova tarefa
        </button>

        <button
          className={
            "rounded-[4px] py-1 p-8 font-bold bg-emerald-400 text-white"
          }
          onClick={() => setListTagsModalIsVisible(true)}
        >
          Gerenciar Tags
        </button>
      </div>

      {createTaskModalIsVisible && (
        <CreateTask
          onSave={reloadData}
          closeModal={() => setCreateTaskModalIsVisible(false)}
        />
      )}

      {listTagsModalIsVisible && (
        <ListTags closeModal={() => setListTagsModalIsVisible(false)} />
      )}
    </div>
  );
}
