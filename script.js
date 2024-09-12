async function fetchScholarPage(url) {
  try {
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    const response = await fetch(corsProxy + url); // Prepend the CORS proxy to bypass restrictions
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const text = await response.text();
    const parser = new DOMParser();
    return parser.parseFromString(text, 'text/html');
  } catch (error) {
    console.error('Error fetching the page:', error);
    return null;
  }
}


async function generateBio(event) {
  event.preventDefault();

  const baseUrl = document.getElementById('scholar-url').value;
  const bioUrl = baseUrl;
  const grantsUrl = `${baseUrl}/grants`;
  const teachingUrl = `${baseUrl}/teaching`;

  try {
    // Fetch bio page
    const bioDoc = await fetchScholarPage(bioUrl);
    if (!bioDoc) throw new Error('Bio fetch failed');

    // Extract the bio section using the correct class
    const bioSection = bioDoc.querySelector('.whiteBox__body___nZQwU');
    const bio = bioSection ? bioSection.innerText : 'Bio not available';

    // Fetch research (grants) page
    const grantsDoc = await fetchScholarPage(grantsUrl);
    const grantsItems = grantsDoc ? grantsDoc.querySelectorAll('.grant-list-item') : [];
    const grants = grantsItems.length ? Array.from(grantsItems).map(item => item.innerText).join(', ') : 'Research information not available';

    // Fetch teaching page
    const teachingDoc = await fetchScholarPage(teachingUrl);
    const teachingItems = teachingDoc ? teachingDoc.querySelectorAll('.teaching-list-item') : [];
    const teaching = teachingItems.length ? Array.from(teachingItems).map(item => item.innerText).join(', ') : 'Teaching information not available';

    // Generate the final bio
    const generatedBio = `
      <p><strong>Bio:</strong> ${bio}</p>
      <p><strong>Research:</strong> ${grants}</p>
      <p><strong>Teaching:</strong> ${teaching}</p>
    `;

    // Display the generated bio
    document.getElementById('generated-bio').innerHTML = generatedBio;

  } catch (error) {
    console.error(error);
    document.getElementById('generated-bio').innerText = error.message;
  }
}

// Add event listener for form submission
document.getElementById('faculty-bio-form').addEventListener('submit', generateBio);
