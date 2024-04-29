import { useLoading } from "@/hooks/useLoading";

export function Loading() {
  const { isLoading } = useLoading();

  if (isLoading) {
    return (
      <div
        data-testid="loading"
        className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50"
      >
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-solid border-whiteBackgroundLight">
          <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-solid border-primaryColor"></div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
