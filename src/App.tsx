import { useMemo, useRef } from 'react';
import { useFetch } from './common/hooks';
import { LIMIT } from './common/constants';

type BreedsMessage = {
  message: {
    [key: string]: string[];
  };
};

function App() {
  const isComponentMounted = useRef(true);

  const { data, loading, error } = useFetch<BreedsMessage>({
    url: `https://dog.ceo/api/breeds/list/all`,
    ref: isComponentMounted,
  });

  const breeds = useMemo(() => {
    return data
      ? Object.keys(data.message)
          .filter((_, index) => index < LIMIT)
          .sort((previous, latter) => (previous > latter ? 1 : -1))
      : null;
  }, [data]);

  type BreedsType = {
    breeds: string[];
  };

  const Breeds = ({ breeds }: BreedsType) => {
    return (
      <div className="container m-auto grid grid-cols-4 gap-1">
        {breeds.map((breed, index) => (
          <div
            className="cursor-pointer capitalize bg-gray-200 hover:bg-gray-400 justify-center text-center my-1 mx-4 p-4 "
            key={`${index}_${breed}`}
          >
            {breed}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between flex-wrap my-2 mx-4">
        <div>Dogs!!</div>
        <div>
          <input
            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search breed"
          />
        </div>
      </div>
      <div>
        {loading ? 'Loading...' : null}
        {error ? 'An error has occurred' : null}
        {!loading && !error && breeds ? <Breeds breeds={breeds} /> : null}
      </div>
    </>
  );
}

export default App;
