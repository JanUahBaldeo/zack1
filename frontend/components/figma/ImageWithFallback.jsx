import { useState } from 'react';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNDQiIGN5PSI0NCIgcj0iNDQiIGZpbGw9IiNFNUU1RTUiLz48dGV4dCB4PSI0NCIgeT0iNDgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuMzVlbSIgZm9udC1zaXplPSIxNnB4IiBmaWxsPSIjQ0NDQ0NDIj5FcnJvcjwvdGV4dD48L3N2Zz4=';

export function ImageWithFallback(props) {
  const [didError, setDidError] = useState(false);
  const { src, alt, ...rest } = props;
  return (
    <img
      src={didError ? ERROR_IMG_SRC : src}
      alt={alt}
      onError={() => setDidError(true)}
      {...rest}
    />
  );
}
