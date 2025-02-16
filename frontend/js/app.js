// Function to preview uploaded images
function previewImage(inputElement, previewElementId) {
  const file = inputElement.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const previewElement = document.getElementById(previewElementId);
      previewElement.innerHTML = `<img src="${e.target.result}" alt="Preview" style="width: 100px; height: auto;">`;
    };
    reader.onerror = function () {
      alert("Error loading file.");
    };
    reader.readAsDataURL(file);
  }
}

// Function to save images to localStorage
function saveImage(category, inputElementId) {
  const fileInput = document.getElementById(inputElementId);
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select an image to save!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const savedItems = JSON.parse(localStorage.getItem("wardrobe")) || {};

    if (!Array.isArray(savedItems[category])) {
      savedItems[category] = [];
    }

    savedItems[category].push(e.target.result);

    localStorage.setItem("wardrobe", JSON.stringify(savedItems));

    displaySavedItems();
  };
  reader.readAsDataURL(file);
}

// Function to display saved items
function displaySavedItems() {
  const savedItems = JSON.parse(localStorage.getItem("wardrobe")) || {};
  const savedPreviews = document.getElementById("saved-previews");
  savedPreviews.innerHTML = "";  // Clear previews

  for (const category in savedItems) {
    if (Array.isArray(savedItems[category])) {
      savedItems[category].forEach((imageData) => {
        const img = document.createElement("img");
        img.src = imageData;
        img.alt = `${category} image`;
        img.style.width = "100px";
        img.style.height = "auto";
        img.style.margin = "5px";
        savedPreviews.appendChild(img);
      });
    }
  }
}

// Event listeners for file inputs and save buttons
document.getElementById("upload-top").addEventListener("change", function () {
  previewImage(this, "preview-top");
});
document.getElementById("save-top").addEventListener("click", function () {
  saveImage("top", "upload-top");
});

document.getElementById("upload-bottom").addEventListener("change", function () {
  previewImage(this, "preview-bottom");
});
document.getElementById("save-bottom").addEventListener("click", function () {
  saveImage("bottom", "upload-bottom");
});

document.getElementById("upload-shoes").addEventListener("change", function () {
  previewImage(this, "preview-shoes");
});
document.getElementById("save-shoes").addEventListener("click", function () {
  saveImage("shoes", "upload-shoes");
});

// Function to save image to the server
function saveImageToServer(category, inputElementId) {
  const fileInput = document.getElementById(inputElementId);
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select an image to save!");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  fetch("http://localhost:3000/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.filePath) {
        const savedItems = JSON.parse(localStorage.getItem("wardrobe")) || {};
        if (!Array.isArray(savedItems[category])) {
          savedItems[category] = [];
        }
        savedItems[category].push(data.filePath); // Save the file URL
        localStorage.setItem("wardrobe", JSON.stringify(savedItems));
        displaySavedItems();
      }
    })
    .catch((error) => console.error("Error uploading file:", error));
}

// Load saved items on page load
window.onload = displaySavedItems;

// Navigate to mix and match page
document.addEventListener("DOMContentLoaded", () => {
  const createOutfitButton = document.getElementById("create-outfit-btn");
  if (createOutfitButton) {
    createOutfitButton.addEventListener("click", function () {
      window.location.href = "mix_and_match.html";
    });
  } else {
    console.error("Create Outfit button not found!");
  }
});
