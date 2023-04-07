const apiKey = '26c72b1be7839b165f1d4370d6a5dd35';

const searchButton = document.getElementById('get-images');
const searchInput = document.querySelector('input[name="search-text"]');
const imageSize = document.getElementById('image-size');
const imageCount = document.getElementById('image-count');
const imageContainer = document.getElementById('image-container');

searchButton.addEventListener('click', async function() {
    clearErrors();
    const searchText = searchInput.value.trim();
    const size = imageSize.value;
    const count = parseInt(imageCount.value);
    if (searchText !== '') {
      clearImages();
      const url = `https://www.flickr.com/services/rest/?api_key=${apiKey}&method=flickr.photos.search&text=${searchText}&format=json&nojsoncallback=1&per_page=${count}&page=1`;
  
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          data.photos.photo.forEach(photo => {
            let imgUrl;
            if(size === "l"){
              imgUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;
            } else if(size === "m"){
              imgUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${size}.jpg`;
            } else if(size === "s"){
              imgUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${size}.jpg`;
            }
            displayImg(imgUrl);
          });
        } else {
          throw new Error('Oops, något gick fel!');
        }
      } catch (error) {
        showError(error.message);
      }
    } else {
      showError('Var god ange ett sökord');
    }
  });
  
  function clearErrors() {
    const errors = document.querySelectorAll('.error');
    errors.forEach(error => error.remove());
  }

function showError(message) {
  const error = document.createElement('p');
  error.innerText = 'Bilden som angivet kunde inte hittas, var god försök igen'
  error.classList.add('error');
  error.textContent = message;
  imageContainer.appendChild(error);
}

function displayImg(url) {
  const img = document.createElement('img');
  img.src = url;
  img.addEventListener('error', function() {
    showError(`Fel vid hämtning av bild ${url}`);
  });
  imageContainer.appendChild(img);
}

function clearImages() {
  const images = document.querySelectorAll('img');

  for (const img of images) {
    img.remove();
  }
}

const sizeOptions = document.querySelectorAll('#image-size option');

sizeOptions.forEach(option => {
  option.addEventListener('click', function() {
    clearImages();
    const currentOption = document.querySelector('#image-size option:checked').value;
    sizeOptions.forEach(option => {
      option.removeAttribute('selected');
    });
    option.setAttribute('selected', 'selected');
  });
});