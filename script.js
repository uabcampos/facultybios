async function fetchScholarPage(url) {
  try {
    const response = await fetch(url);
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

  // Fetch bio, research (grants), and teaching info
  const bioDoc = await fetchScholarPage(bioUrl);
  const grantsDoc = await fetchScholarPage(grantsUrl);
  const teachingDoc = await fetchScholarPage(teachingUrl);

  if (!bioDoc || !grantsDoc || !teachingDoc) {
    document.getElementById('generated-bio').innerText = 'Could not fetch all required information.';
    return;
  }

  // Extract bio from Scholar Profile
  const bioSection = bioDoc.querySelector('.field-name-field-profile-bio');
  const bio = bioSection ? bioSection.innerText : 'Bio not available';

  // Extract research information from grants page
  const grantsItems = grantsDoc.querySelectorAll('.grant-list-item');
  const grants = grantsItems.length ? Array.from(grantsItems).map(item => item.innerText).join(', ') : 'Research information not available';

  // Extract teaching information from teaching page
  const teachingItems = teachingDoc.querySelectorAll('.teaching-list-item');
  const teaching = teachingItems.length ? Array.from(teachingItems).map(item => item.innerText).join(', ') : 'Teaching information not available';

  // Generate the final bio
  const generatedBio = `
    <p><strong>Bio:</strong> ${bio}</p>
    <p><strong>Research:</strong> ${grants}</p>
    <p><strong>Teaching:</strong> ${teaching}</p>
  `;

  // Display the generated bio
  document.getElementById('generated-bio').innerHTML = generatedBio;
}

// Add event listener for form submission
document.getElementById('faculty-bio-form').addEventListener('submit', generateBio);
