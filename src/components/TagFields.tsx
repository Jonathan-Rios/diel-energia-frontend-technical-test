import { ITags } from "@/@types/tags";
import { useFetch } from "@/hooks/useFetch";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface ITagsResponse {
  tags: ITags[];
}
interface TagsFieldsProps {
  selectedTags: ITags[];
  setSelectedTags: React.Dispatch<React.SetStateAction<ITags[]>>;
  pageMode?: boolean;
}

export function TagsFields({
  selectedTags,
  setSelectedTags,
  pageMode = false,
}: TagsFieldsProps) {
  const [selectTagField, setSelectTagField] = useState<string>("");

  const { response: responseTags } = useFetch<ITagsResponse>(`/tags`);
  const tags = responseTags?.tags || [];

  function handleAddTag(id: string) {
    const tagToAdd = tags.find((tag) => tag.id === id);

    if (!tagToAdd) {
      return;
    }

    if (!selectedTags?.some((selectedTag) => selectedTag.id === id)) {
      setSelectedTags((prev) => [...(prev || []), tagToAdd]);
    }
    setSelectTagField("");
  }

  function handleRemoveTags(id: string) {
    if (selectedTags?.length) {
      setSelectedTags((prev) => prev!.filter((tag) => tag.id !== id));
    }
  }

  return (
    <div
      className={`${pageMode ? "flex flex-row-reverse mr-auto gap-4 mb-2" : ""}`}
    >
      {selectedTags?.length ? (
        <div className="flex flex-col">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold">
            Tags
          </label>
          <div className="flex w-full gap-4 border border-slate-200 rounded-md p-[6px] overflow-y-auto max-w-[600px] mb-2">
            {selectedTags?.map((tag) => (
              <span
                key={tag.id}
                className="bg-white rounded-[4px] h-8 px-2 text-gray-1200 text-slate-800 flex items-center justify-center relative"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
                <button
                  type="button"
                  className="flex border ml-4  rounded-md border-red-50 bg-red-600 w-6 h-6 items-center justify-center"
                  onClick={() => handleRemoveTags(tag.id)}
                >
                  <Trash2 className="text-red-50" size={16} />
                </button>
              </span>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="flex flex-col">
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold">
          Adicionar Tag
        </label>
        <select
          className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="select-tag"
          onChange={(e) => {
            handleAddTag(e.target.value);
          }}
          value={selectTagField}
        >
          <option value="">Selecione uma tag</option>

          {tags
            .filter(
              (tag) =>
                !selectedTags.some((selectedTag) => selectedTag.id === tag.id)
            )
            .map((tag) => (
              <option key={tag.id} style={{ color: tag.color }} value={tag.id}>
                {tag.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}
