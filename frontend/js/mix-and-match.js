// Initialize arrays for storing categorized images
let tops = [];
let bottoms = [];
let shoes = [];

// Fetch uploaded images from the server
async function fetchImages() {
  try {
    const response = await fetch("http://localhost:3000/images");
    const imagesList = await response.json();

    // Categorize images based on their file names
    tops = imagesList.filter((image) => image.toLowerCase().includes("top"));
    bottoms = imagesList.filter((image) =>
      image.toLowerCase().includes("bottom")
    );
    shoes = imagesList.filter((image) =>
      image.toLowerCase().includes("shoes")
    );

    console.log("Fetched Images:", { tops, bottoms, shoes });

    // Set slider ranges dynamically
    document.getElementById("top-slider").max = tops.length - 1;
    document.getElementById("bottom-slider").max = bottoms.length - 1;
    document.getElementById("shoes-slider").max = shoes.length - 1;

    // Set default previews if images are available
    if (tops.length > 0) {
      document.getElementById("top-preview").src = `http://localhost:3000${tops[0]}`;
    }
    if (bottoms.length > 0) {
      document.getElementById("bottom-preview").src = `http://localhost:3000${bottoms[0]}`;
    }
    if (shoes.length > 0) {
      document.getElementById("shoes-preview").src = `http://localhost:3000${shoes[0]}`;
    }
  } catch (error) {
    console.error("Error fetching images:", error);
  }
}

// Update the preview image when a slider is changed
function updatePreview(category) {
  const slider = document.getElementById(`${category}-slider`);
  const preview = document.getElementById(`${category}-preview`);
  let categoryArray;

  // Select the appropriate array based on the category
  if (category === "top") {
    categoryArray = tops;
  } else if (category === "bottom") {
    categoryArray = bottoms;
  } else if (category === "shoes") {
    categoryArray = shoes;
  }

  // Update the preview image
  const imageIndex = slider.value;
  if (categoryArray && categoryArray[imageIndex]) {
    const imageUrl = `http://localhost:3000${categoryArray[imageIndex]}`;
    console.log(`Previewing ${category}:`, imageUrl);
    preview.src = imageUrl;
  } else {
    preview.alt = `No ${category} images available`;
  }
}

// Fetch images on page load
fetchImages();
