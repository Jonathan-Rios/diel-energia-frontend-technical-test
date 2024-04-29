import { ITask } from "@/@types/tasks";
import { useFetch } from "@/hooks/useFetch";
import { hourFormat } from "@/utils/hoursFormat";
import { EditTask } from "@/components/tasks/EditTask";
import { ModalManager } from "@/components/ModalManager";
import { TagsFields } from "@/components/TagFields";
import { ITags } from "@/@types/tags";
import { useState } from "react";
import { Header } from "@/components/Header";

interface IResponse {
  schedules: {
    date: string;
    activities: ITask[];
  }[];
}

interface IHoliday {
  date: string;
  localName: string;
}

export function Monthly() {
  const [editTaskModalIsVisible, setEditTaskModalIsVisible] =
    useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<ITags[]>([]);

  const { response, reloadData } = useFetch<IResponse>("/tasks/list/monthly");
  const schedules = response?.schedules || [];

  const { response: responseHoliday } = useFetch<IHoliday[]>(
    "https://date.nager.at/api/v3/publicholidays/2024/BR"
  );
  const holidays = responseHoliday || [];

  function handleEdit(id: string) {
    setEditTaskModalIsVisible(true);
    setSelectedId(id);
  }

  const filteredSchedules = schedules.map((schedule) => ({
    ...schedule,
    activities:
      selectedTags.length === 0
        ? schedule.activities.filter((activity) =>
            activity.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : schedule.activities
            .filter((activity) => {
              return selectedTags.every((selectedTag) =>
                activity.tags.some((tag) => tag.id === selectedTag.id)
              );
            })
            .filter((activity) =>
              activity.title.toLowerCase().includes(searchTerm.toLowerCase())
            ),
  }));

  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <div className="flex flex-col items-center justify-center px-4 w-full">
        <Header />

        <div className="w-full flex flex-col">
          <div className="flex w-full">
            <div className="flex w-full flex-col">
              <TagsFields
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                pageMode
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar por título..."
                className="block appearance-none bg-gray-200 placeholder:text-gray-700 border-gray-200 text-gray-700 p-2 border rounded-md w-80 h-12 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>

            <ModalManager reloadData={reloadData} />
          </div>

          <h1 className="text-2xl text-slate-500 my-2 capitalize text-nowrap">
            {new Intl.DateTimeFormat("pt-BR", {
              weekday: "long",
              day: "2-digit",
            }).format(new Date())}
          </h1>
          <div className="w-full overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr>
                  {daysOfWeek.map((day) => (
                    <th key={day} className="p-4 border-slate-200">
                      <div className="flex flex-col">
                        <h2 className="text-xs text-slate-400 uppercase">
                          {day}
                        </h2>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(5).keys()].map((rowIndex) => (
                  <tr key={rowIndex} className="h-32">
                    {daysOfWeek.map((_, colIndex) => {
                      const currentDateIndex = rowIndex * 7 + colIndex;
                      const currentSchedule =
                        filteredSchedules[currentDateIndex];
                      return (
                        <td
                          key={`${rowIndex}-${colIndex}`}
                          className="border border-slate-200 w-[13%] align-top"
                        >
                          {currentSchedule && (
                            <>
                              <div className="flex flex-col items-center">
                                <div className="p-1 bg-white rounded-t-md mb-auto flex flex-col items-center justify-center">
                                  <h2 className="text-xs font-bold text-slate-700">
                                    {new Date(
                                      currentSchedule.date
                                    ).toLocaleDateString("pt-BR", {
                                      day: "numeric",
                                    })}
                                  </h2>

                                  {holidays
                                    .filter(
                                      (holiday) =>
                                        new Date(holiday.date)
                                          .toISOString()
                                          .split("T")[0] ===
                                        new Date(currentSchedule.date)
                                          .toISOString()
                                          .split("T")[0]
                                    )
                                    .map((holiday) => (
                                      <div
                                        className="text-emerald-500"
                                        key={holiday.localName}
                                      >
                                        {holiday.localName}
                                      </div>
                                    ))}
                                </div>
                                <div className="p-1 h-full overflow-auto w-full gap-1 flex flex-col">
                                  {currentSchedule.activities.map((task) => (
                                    <div
                                      key={task.id}
                                      className="flex flex-col gap-2 p-1 rounded-md bg-cyan-800 text-white cursor-pointer"
                                      onClick={() => handleEdit(task.id)}
                                    >
                                      <div className="flex">
                                        <h2 className="text-xs font-bold truncate truncate-overflow-ellipsis">
                                          {hourFormat(task.dueAt)} -{" "}
                                          {task.title}
                                        </h2>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            {editTaskModalIsVisible && selectedId && (
              <EditTask
                id={selectedId}
                closeModal={() => setEditTaskModalIsVisible(false)}
                onEdit={reloadData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
