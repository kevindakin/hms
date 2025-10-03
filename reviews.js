function injectGalleryItems() {
  const reviewsGrid = document.querySelector('[data-reviews="list"]');
  const galleryContainer = document.querySelector('[data-reviews="gallery"]');

  if (!reviewsGrid || !galleryContainer) {
    console.warn("Reviews grid or gallery container not found");
    return;
  }

  const galleryItems = Array.from(
    galleryContainer.querySelectorAll('[data-reviews="gallery-item"]')
  );
  const reviews = Array.from(reviewsGrid.children);

  if (galleryItems.length === 0 || reviews.length === 0) {
    console.warn("No gallery items or reviews found");
    return;
  }

  // Shuffle gallery items once
  const shuffledGallery = galleryItems.sort(() => Math.random() - 0.5);

  // Create a merged array with controlled spacing
  const injectionFrequency = 3;
  const merged = [];
  let galleryIndex = 0;

  reviews.forEach((review, index) => {
    merged.push(review);

    // Inject gallery item at intervals, but add randomness of ±1 position
    const basePosition = (index + 1) % injectionFrequency === 0;
    const randomOffset = Math.random() > 0.5 ? 1 : 0;

    if (
      basePosition &&
      randomOffset === 1 &&
      galleryIndex < shuffledGallery.length
    ) {
      const clone = shuffledGallery[galleryIndex].cloneNode(true);
      clone.style.display = "block";
      merged.push(clone);
      galleryIndex++;
    }
  });

  // Clear the grid and rebuild with merged array
  reviewsGrid.innerHTML = "";
  merged.forEach((item) => reviewsGrid.appendChild(item));

  // Clean up the hidden gallery container
  galleryContainer.remove();
}

// Call on page load
window.addEventListener("load", injectGalleryItems);
