// Получить id из URL
function getReviewId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function renderReview(review) {
  const section = document.getElementById('review-section');
  if (!review) {
    section.innerHTML = '<h2>Обзор не найден</h2>';
    return;
  }
  section.innerHTML = `
    <div class="review-info">
      <img class="review-image" src="${review.image}" alt="${review.title}">
      <h1>${review.title}</h1>
      <div class="review-content">${review.content}</div>
    </div>
  `;
}

function renderComparison(review) {
  const section = document.getElementById('comparison-section');
  if (review && review.comparison) {
    section.innerHTML = review.comparison;
  } else {
    section.innerHTML = '';
  }
}

function renderFAQ(review) {
  const section = document.getElementById('faq-section');
  if (review && review.faq) {
    section.innerHTML = review.faq;
  } else {
    section.innerHTML = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const id = getReviewId();
  const review = reviewsData.find(r => r.id === id);
  renderReview(review);
  renderComparison(review);
  renderFAQ(review);
}); 