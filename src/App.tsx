import { useEffect, useMemo, useRef, useState } from 'react';
import { useFetch } from './common/hooks';
import { LIMIT } from './common/constants';

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

  type ImageMessage = {
    message: string[];
  };

  type ImagesProps = {
    breed: string;
  };

  const Images = ({ breed }: ImagesProps) => {
    const ref = useRef(true);
    const { data, loading, error } = useFetch<ImageMessage>({
      url: `https://dog.ceo/api/breed/${breed}/images`,
      ref,
    });

    const [imageLimit, setImageLimit] = useState<number>(20);
    const [imageLinks, setImageLinks] = useState<string[]>([]);

    useEffect(() => {
      const imageUrls =
        data?.message.filter((_, index) => index < imageLimit) ?? [];
      setImageLinks(imageUrls);
    }, [imageLimit, data]);

    const handleClick = () => setImageLimit(imageLimit + 20);
    console.log({ imageLinks });
    return (
      <>
        {loading ? 'Loading Images' : null}
        {error ? 'Error loading images' : null}
        {!loading && data && imageLinks.length > 0 ? (
          <div className="flex flex-col">
            <div className="container m-auto grid grid-cols-4 gap-4 my-8">
              {imageLinks.map((link, index) => (
                <div
                  className="flex flex-col border border-black-300"
                  key={link}
                >
                  <img
                    alt="Getting Image"
                    className="w-full h-48 object-cover"
                    src={link}
                    loading="lazy"
                  />
                  <div className="text-center">{index + 1}</div>
                </div>
              ))}
            </div>
            <div className="self-center my-4">
              {imageLimit < data.message.length ? (
                <div
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                  onClick={handleClick}
                >
                  Show More
                </div>
              ) : (
                <div className="font-bold text-lg mb-4">No More Images</div>
              )}
            </div>
          </div>
        ) : null}
      </>
    );
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
