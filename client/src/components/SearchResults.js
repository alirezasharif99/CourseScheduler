import React from 'react';
import CourseResult from './CourseResult';

const SearchResults = ({ id, results }) => {
  return (
    <div className='accordion accordion-flush' id={`${id}-accordion`}>
      {results.map((result) => (
        <CourseResult key={result.id} accordion={id} data={result} opened={results.length === 1} />
      ))}
    </div>
  );
};

export default SearchResults;
