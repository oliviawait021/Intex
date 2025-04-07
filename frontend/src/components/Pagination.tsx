interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  const getPageButtons = () => {
    const buttons = [];

    // First page
    if (currentPage > 2) {
      buttons.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className="border px-2 py-1 font-semibold rounded-l"
        >
          1
        </button>
      );
      if (currentPage > 3) {
        buttons.push(
          <button
            key="start-ellipsis"
            disabled
            className="border px-2 py-1 bg-white"
          >
            ...
          </button>
        );
      }
    }

    // Middle pages
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 0 && i <= totalPages) {
        buttons.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            disabled={i === currentPage}
            className={`border px-2 py-1 ${
              i === currentPage ? 'font-bold bg-gray-100' : 'bg-white'
            }`}
          >
            {i}
          </button>
        );
      }
    }

    // Last page
    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) {
        buttons.push(
          <button
            key="end-ellipsis"
            disabled
            className="border px-2 py-1 bg-white"
          >
            ...
          </button>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="border px-2 py-1 font-semibold rounded-r"
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="flex flex-col items-center justify-center mt-4 space-y-2">
      <div className="flex gap-1 flex-wrap justify-center items-center">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="border px-2 py-1 rounded bg-white"
        >
          Previous
        </button>

        {getPageButtons()}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="border px-2 py-1 rounded bg-white"
        >
          Next
        </button>
      </div>

      <label className="mt-2">
        Results per page:
        <select
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1);
          }}
          className="ml-2 border px-2 py-1"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </label>
    </div>
  );
};

export default Pagination;
