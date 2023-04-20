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
            className={`cursor-pointer capitalize bg-gray-200 justify-center text-center my-1 mx-4 p-4 ${
              currentSelectedBreed === breed
                ? 'bg-blue-500 hover:bg-blue-400'
                : 'hover:bg-gray-400'
            }`}
            key={`${index}_${breed}`}
            onClick={() => handleClick(breed)}
          >
            {breed}
          </div>
        ))
      ) : (
        <div>No breeds found</div>
      )}
    </div>
  );
};

export default Breeds;
