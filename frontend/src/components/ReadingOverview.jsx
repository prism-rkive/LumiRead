import { useNavigate } from "react-router-dom";

const ReadingOverview = ({ books = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Currently Reading
        </h2>

        <button
          onClick={() => navigate("/bookshelf")}
          className="text-sm text-red-600 hover:underline"
        >
          View More →
        </button>
      </div>

      {books.length === 0 ? (
        <p className="text-gray-500">Time to add a new book!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book._id} className="p-4 bg-white rounded-xl">
              <img
                src={book.cover_img}
                alt={book.title}
                className="w-12 h-16"
              />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadingOverview;
