const SEARCH_API = process.env.URL + '/api/test';

export async function getResultsList() {
  const response = await fetch(SEARCH_API);
  const data = await response.json();
  return data.results;
}


  // Data is an array of objects, each object has an id, image_path, title, price, location, post_url, etc