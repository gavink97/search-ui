const SEARCH_API = process.env.URL + '/api/search';

export async function getResultsList() {
   try {
    const res = await fetch(SEARCH_API, {
//      cache: 'no-cache',
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
