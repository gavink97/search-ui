const SEARCH_API = process.env.URL + '/api/search';

export async function getResultsList() {
   try {
    const res = await fetch(SEARCH_API, {
      next: {
        revalidate: 5,
      },
    });
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error('Error parsing response:', error);
    return [];
  }
}
  // Data is an array of objects, each object has an id, image_path, title, price, location, post_url, etc