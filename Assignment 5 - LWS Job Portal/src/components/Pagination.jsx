import { scrollToTop } from "../utils";

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);


  if (totalPages <= 1) return null;

  const renderPageButtons = () => {
    const pages = [];
    const windowSize = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - windowSize && i <= currentPage + windowSize)
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => {
              scrollToTop();
              onPageChange(i);
            }}
            className={`px-3 py-1 mx-1 rounded border transition-colors cursor-pointer ${
              currentPage === i
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white hover:bg-gray-100 text-gray-700"
            }`}
          >
            {i}
          </button>
        );
      } else if (
        i === currentPage - windowSize - 1 ||
        i === currentPage + windowSize + 1
      ) {
        pages.push(
          <span key={i} className="px-2 text-gray-400">
            ...
          </span>
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-wrap items-center justify-center space-x-2 mt-8 mb-12">
      <button
        disabled={currentPage === 1}
        onClick={() => {
          scrollToTop();
          onPageChange(currentPage - 1);
        }}
        className="px-4 py-2 border rounded bg-white disabled:opacity-30 hover:bg-gray-100 text-gray-700 cursor-pointer"
      >
        Previous
      </button>

      <div className="flex items-center">{renderPageButtons()}</div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => {
          scrollToTop();
          onPageChange(currentPage + 1);
        }}
        className="px-4 py-2 border rounded bg-white disabled:opacity-30 hover:bg-gray-100 text-gray-700 cursor-pointer"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
