// Composant pour la pagination
export default function Pagination({ 
  currentPage, 
  totalPages, 
  totalItems, 
  onPageChange 
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        «
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        ‹
      </button>
      <span className="pagination-info">
        Page {currentPage} sur {totalPages} ({totalItems} transactions)
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        ›
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        »
      </button>

      <style jsx>{`
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 20px 0;
          gap: 10px;
        }
        .pagination-button {
          padding: 5px 10px;
          border: 1px solid #ddd;
          background-color: #f8f8f8;
          cursor: pointer;
          border-radius: 3px;
          min-width: 30px;
          text-align: center;
        }
        .pagination-button:hover:not(:disabled) {
          background-color: #e0e0e0;
        }
        .pagination-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .pagination-info {
          padding: 0 10px;
          color: #666;
        }
      `}</style>
    </div>
  );
}