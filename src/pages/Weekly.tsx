import { useState } from "react";
import { ITask } from "@/@types/tasks";
import { useFetch } from "@/hooks/useFetch";
import { convertMinutesToHours } from "@/utils/hoursFormat";
import { EditTask } from "@/components/tasks/EditTask";
import { ModalManager } from "@/components/ModalManager";
import { TagsFields } from "@/components/TagFields";
import { ITags } from "@/@types/tags";
import { Header } from "@/components/Header";

interface IResponse {
  schedules: {
    date: string;
    hours: {
      hour: string;
      activities: ITask[];
    }[];
  }[];
}

interface IHoliday {
  date: string;
  localName: string;
}

export function Weekly() {
  const [editTaskModalIsVisible, setEditTaskModalIsVisible] =
    useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<ITags[]>([]);

  const { response, reloadData } = useFetch<IResponse>("/tasks/list/weekly");
  const schedules = response?.schedules || [];

  const { response: responseHoliday } = useFetch<IHoliday[]>(
    "https://date.nager.at/api/v3/publicholidays/2024/BR"
  );
  const holidays = responseHoliday || [];

  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredSchedules = schedules.map((schedule) => ({
    ...schedule,
    hours: schedule.hours.map((hour) => ({
      ...hour,
      activities:
        selectedTags.length === 0
          ? hour.activities.filter((activity) =>
              activity.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : hour.activities
              .filter((activity) => {
                return selectedTags.every((selectedTag) =>
                  activity.tags.some((tag) => tag.id === selectedTag.id)
                );
              })
              .filter((activity) =>
                activity.title.toLowerCase().includes(searchTerm.toLowerCase())
              ),
    })),
  }));

  function handleEdit(id: string) {
    setEditTaskModalIsVisible(true);
    setSelectedId(id);
  }

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
                  <th className="p-4 border-slate-200"></th>
                  {schedules.map((schedule, index) => (
                    <th key={index} className=" p-4 border-slate-200">
                      <div className="flex flex-col">
                        <h2 className="text-xs text-slate-400 uppercase">
                          {new Date(schedule.date).toLocaleDateString("pt-BR", {
                            weekday: "short",
                          })}
                        </h2>
                        <h2 className="text-xl text-slate-400">
                          {new Date(schedule.date).toLocaleDateString("pt-BR", {
                            day: "numeric",
                          })}
                        </h2>

                        {holidays
                          .filter(
                            (holiday) =>
                              holiday.date.split("T")[0] ===
                              schedule.date.split("T")[0]
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
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(24).keys()].map((hour) => (
                  <tr key={hour}>
                    <td className="border border-l-0 p-4 border-slate-200 w-[9%]">
                      <h3 className="text-md text-slate-400">
                        {hour.toString().padStart(2, "0")}:00
                      </h3>
                    </td>
                    {filteredSchedules.map((schedule, index) => (
                      <td
                        key={index}
                        className="border border-r-0 border-slate-200  w-[13%]"
                      >
                        <div className="p-1 h-full overflow-auto w-full gap-1 flex flex-col">
                          {schedule.hours
                            .find(
                              (hourActivity) =>
                                hourActivity.hour.substring(0, 2) ===
                                hour.toString().padStart(2, "0")
                            )
                            ?.activities.map((task) => (
                              <div
                                key={task.id}
                                className="flex flex-col w-full gap-2 p-2 rounded-md bg-cyan-800 text-white cursor-pointer"
                                onClick={() => handleEdit(task.id)}
                              >
                                <div className="flex justify-between">
                                  <h2 className="text-xs font-bold truncate">
                                    {task.title}
                                  </h2>
                                  <p className="text-xs">
                                    Duração:{" "}
                                    {convertMinutesToHours(
                                      task.durationMinutes,
                                      true
                                    )}
                                  </p>
                                </div>
                                <p className="text-xs text-wrap truncate">
                                  {task.description}
                                </p>
                              </div>
                            ))}
                        </div>
                      </td>
                    ))}
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
          </div>{" "}
        </div>
      </div>
    </div>
  );
}
