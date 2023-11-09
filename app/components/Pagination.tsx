import { FC } from "react";

const Pagination: FC<{
  numberOfPages: number;
  setCurrentPage: (value: number) => void;
  currentPage: number;
}> = ({ numberOfPages, setCurrentPage, currentPage }) => {
  const pages = [];

  for (let i = 0; i < numberOfPages; i++) {
    pages.push(
      <li key={i} data-cy={`page-number-${i + 1}`}>
        <a
          className={`cursor-pointer first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-cyan-600 ${
            i + 1 === currentPage
              ? "bg-cyan-500 text-white"
              : "bg-white text-cyan-950"
          }`}
          onClick={() => setCurrentPage(i + 1)}
        >
          {i + 1}
        </a>
      </li>
    );
  }

  return (
    <div className="py-2 ml-4" data-cy="pagination">
      <nav className="block">
        <ul className="flex pl-0 rounded list-none flex-wrap">{pages}</ul>
      </nav>
    </div>
  );
};

export default Pagination;
