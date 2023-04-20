import { useEffect, useRef, useState } from 'react';

import { useFetch } from '../../common/hooks';
import { IMAGE_LIMIT, PLACEHOLDER_URL } from '../../common/constants';
import { LazyLoadImage } from 'react-lazy-load-image-component';

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

  const [imageLimit, setImageLimit] = useState<number>(IMAGE_LIMIT);
  const [imageLinks, setImageLinks] = useState<string[]>([]);

  useEffect(() => {
    const imageUrls =
      data?.message.filter((_, index) => index < imageLimit) ?? [];
    setImageLinks(imageUrls);
  }, [imageLimit, data]);

  useEffect(() => setImageLimit(IMAGE_LIMIT), [breed]);

  const handleClick = () => setImageLimit(imageLimit + IMAGE_LIMIT);

  return (
    <>
      {loading ? 'Loading Images' : null}
      {error ? 'Error loading images' : null}
      {!loading && data && imageLinks.length > 0 ? (
        <div className="flex flex-col">
          <div className="font-bold self-center mt-8">
            Images of <span className="capitalize">{breed}</span>
          </div>
          <div className="container m-auto grid grid-cols-4 gap-4 my-8">
            {imageLinks.map((link, index) => (
              <div className="flex flex-col border border-black-300" key={link}>
                <LazyLoadImage
                  className="w-full h-48 object-cover"
                  placeholderSrc={PLACEHOLDER_URL}
                  src={link}
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

export default Images;
