// Получить id из URL
function getReviewId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function fetchReviewById(id) {
  try {
    const response = await fetch(`https://lending-juaw.onrender.com/api/equipment-reviews/${id}`);
    if (!response.ok) throw new Error('Обзор не найден');
    return await response.json();
  } catch (e) {
    return null;
  }
}

function renderReview(review) {
  const section = document.getElementById('review-section');
  if (!review) {
    section.innerHTML = '<h2>Обзор не найден</h2>';
    return;
  }
  section.innerHTML = `
    <div class="review-info">
      <img class="review-image" src="https://lending-juaw.onrender.com/${review.image}" alt="${review.title}">
      <h1>${review.title}</h1>
      <div class="review-content">${review.fullText || review.content || ''}</div>
    </div>
  `;
}

function renderComparison(review) {
  const section = document.getElementById('comparison-section');
  if (review && review.comparisonTable && review.comparisonTable.length) {
    // Можно реализовать красивую таблицу, если comparisonTable есть
    section.innerHTML = '<h2>Таблица сравнения</h2>' + JSON.stringify(review.comparisonTable);
  } else {
    section.innerHTML = '';
  }
}

function renderFAQ(review) {
  const section = document.getElementById('faq-section');
  if (review && review.faq && review.faq.length) {
    section.innerHTML = '<h2>FAQ</h2>' + JSON.stringify(review.faq);
  } else {
    section.innerHTML = '';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const id = getReviewId();
  const review = await fetchReviewById(id);
  renderReview(review);
  renderComparison(review);
  renderFAQ(review);
}); 