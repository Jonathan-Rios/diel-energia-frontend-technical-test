import { ITags } from "@/@types/tags";
import { ITask } from "@/@types/tasks";
import { ModalManager } from "@/components/ModalManager";
import { EditTask } from "@/components/tasks/EditTask";
import { TagsFields } from "@/components/TagFields";
import { useFetch } from "@/hooks/useFetch";
import { convertMinutesToHours } from "@/utils/hoursFormat";
import { useState } from "react";
import { Header } from "@/components/Header";

interface IResponse {
  schedules: {
    hour: string;
    activities: ITask[];
  }[];
}

interface IHoliday {
  date: string;
  localName: string;
}

export function Daily() {
  const [editTaskModalIsVisible, setEditTaskModalIsVisible] =
    useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  console.log("Search term:", searchTerm);

  const [selectedTags, setSelectedTags] = useState<ITags[]>([]);

  function handleEdit(id: string) {
    setEditTaskModalIsVisible(true);
    setSelectedId(id);
  }

  const { response, reloadData } = useFetch<IResponse>("/tasks/list");
  const schedules = response?.schedules || [];

  const { response: responseHoliday } = useFetch<IHoliday[]>(
    "https://date.nager.at/api/v3/publicholidays/2024/BR"
  );
  const holidays = responseHoliday || [];

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

            {holidays
              .filter(
                (holiday) =>
                  new Date(holiday.date).toISOString().split("T")[0] ===
                  new Date().toISOString().split("T")[0]
              )
              .map((holiday) => (
                <div className="text-emerald-500" key={holiday.localName}>
                  {holiday.localName}
                </div>
              ))}
          </h1>

          <div className="w-full overflow-x-auto">
            <table className="table-auto w-full ">
              <tbody>
                {filteredSchedules &&
                  filteredSchedules.map((schedule) => (
                    <tr key={schedule.hour}>
                      <td className="border border-l-0 p-4 w-40 border-slate-200">
                        <div className="flex p-2 justify-end">
                          <h2 className="text-xl text-slate-400">
                            {schedule.hour.toString()}
                          </h2>
                        </div>
                      </td>
                      <td className="border border-r-0 p-4 border-slate-200">
                        <div className="flex w-full flex-col gap-2">
                          {schedule.activities &&
                            schedule.activities.map((activity) => (
                              <div
                                key={activity.id}
                                className="flex flex-col w-full gap-2 p-2 rounded-md bg-cyan-800 text-white cursor-pointer"
                                onClick={() => handleEdit(activity.id)}
                              >
                                <div className="flex justify-between">
                                  <h2 className="text-xl font-bold truncate truncate-overflow-ellipsis">
                                    {activity.title}
                                  </h2>
                                  <p>
                                    Duração:{" "}
                                    {convertMinutesToHours(
                                      activity.durationMinutes
                                    )}
                                  </p>
                                </div>
                                <p className="truncate truncate-overflow-ellipsis">
                                  {activity.description}
                                </p>
                              </div>
                            ))}
                        </div>
                      </td>
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
