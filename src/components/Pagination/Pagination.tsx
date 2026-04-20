import "./Pagination.css"

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function PaginationComponent({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const createRange = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  };

  const pageNumbers = (() => {
    if (totalPages <= 1) return [];

    if (totalPages <= 5) {
      return createRange(1, totalPages);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, "...", ...createRange(totalPages - 3, totalPages)];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  })();

  const handlePageClick = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

 if (currentPage > totalPages) return null;

  return (
    <nav className="pagination-wrapper" aria-label="Pagination">
      <button
        className="toggle-prev"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        Prev
      </button>

      {pageNumbers.map((page, index) =>
        typeof page === "number" ? (
          <button
            key={page}
            className={`pagination-page ${currentPage === page ? "active" : ""}`}
            onClick={() => handlePageClick(page)}
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        ) : (
          <span
            key={`${page}-${index}`}
            className="pagination-dots"
            aria-hidden="true"
          >
            ...
          </span>
        ),
      )}

      <button
        className="toggle-next"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        Next
      </button>
    </nav>
  );
}
