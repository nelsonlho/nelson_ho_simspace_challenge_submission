import { useMemo, useRef, useState } from 'react';
import { useFetch } from '../common/hooks';
import { LIMIT } from '../common/constants';
import Breeds from './components/Breeds';
import Images from './components/Images';

type Message = {
  message: {
    [key: string]: string[];
  };
};

function App() {
  const isComponentMounted = useRef(true);

  const { data, loading, error } = useFetch<Message>({
    url: `https://dog.ceo/api/breeds/list/all`,
    ref: isComponentMounted,
  });

  const [query, setQuery] = useState<string>('');
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);

  const breeds = useMemo(() => {
    return data
      ? Object.keys(data.message)
          .filter((breed) => breed.includes(query.toLocaleLowerCase()))
          .filter((_, index) => index < LIMIT)
          .sort((previous, latter) => (previous > latter ? 1 : -1))
      : null;
  }, [data, query]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextQuery = event.target.value ?? '';
    setQuery(nextQuery);
  };

  return (
    <>
      <div className="flex items-center justify-between flex-wrap my-2 mx-4">
        <div>Dogs!</div>
        <div>
          <input
            className="text-black border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 0"
            placeholder="Search breed"
            onChange={handleQueryChange}
            value={query}
          />
        </div>
      </div>
      <div>
        {loading ? 'Loading...' : null}
        {error ? 'An error has occurred' : null}
        {!loading && !error && breeds ? (
          <Breeds
            breeds={breeds}
            currentSelectedBreed={selectedBreed}
            setSelectedBreed={setSelectedBreed}
          />
        ) : null}
        {selectedBreed ? <Images breed={selectedBreed} /> : null}
      </div>
    </>
  );
}

export default App;
