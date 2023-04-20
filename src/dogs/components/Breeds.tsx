type BreedsProps = {
  breeds: string[];
  currentSelectedBreed: string | null;
  setSelectedBreed: (breed: string | null) => void;
};

const Breeds = ({
  breeds,
  currentSelectedBreed,
  setSelectedBreed,
}: BreedsProps) => {
  const handleClick = (breed: string) => setSelectedBreed(breed);
  return (
    <div className="container m-auto grid grid-cols-4 gap-1">
      {breeds.length > 0 ? (
        breeds.map((breed, index) => (
          <div
            className={`cursor-pointer capitalize justify-center text-center my-1 mx-4 p-4 truncate ${
              currentSelectedBreed === breed
                ? 'bg-blue-500 hover:bg-blue-400'
                : 'bg-gray-200 hover:bg-gray-400'
            }`}
            key={`${index}_${breed}`}
            onClick={() => handleClick(breed)}
          >
            {breed}
          </div>
        ))
      ) : (
        <div>No breed matches found</div>
      )}
    </div>
  );
};

export default Breeds;
