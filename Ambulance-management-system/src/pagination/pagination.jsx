import React from "react";

export function Pagination({ currentPage, totalPages, setCurrentPage }) {
  const pagesPerGroup = 5;
  const currentGroup = Math.ceil(currentPage / pagesPerGroup);
  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="flex flex-col items-center mt-8 gap-4">
      <span className="text-sm text-neutral-500">
        Page {currentPage} of {totalPages}
      </span>
      {totalPages > 1 && (
        <>
          <div className="flex items-center gap-1">
            {currentPage > 2 && (
              <button
                onClick={() => setCurrentPage(1)}
                className="px-3 py-1.5 text-sm border border-neutral-200 rounded-lg text-neutral-600 hover:bg-black hover:text-white hover:border-black transition-all"
              >
                First
              </button>
            )}

            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm border border-neutral-200 rounded-lg text-neutral-600 hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-neutral-600 disabled:hover:border-neutral-200"
            >
              Prev
            </button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  currentPage === page
                    ? "bg-black text-white"
                    : "border border-neutral-200 text-neutral-600 hover:bg-black hover:text-white hover:border-black"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm border border-neutral-200 rounded-lg text-neutral-600 hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-neutral-600 disabled:hover:border-neutral-200"
            >
              Next
            </button>

            {currentPage < totalPages - 1 && (
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="px-3 py-1.5 text-sm border border-neutral-200 rounded-lg text-neutral-600 hover:bg-black hover:text-white hover:border-black transition-all"
              >
                Last
              </button>
            )}
          </div>

          <input
            className="px-3 py-1.5 text-sm border border-neutral-200 rounded-lg bg-white text-black w-32 text-center focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            type="number"
            placeholder="Go to page"
            min={1}
            max={totalPages}
            onChange={(e) => {
              const page = Number(e.target.value);
              if (page >= 1 && page <= totalPages) {
                setCurrentPage(page);
              }
            }}
          />
        </>
      )}
    </div>
  );
}
