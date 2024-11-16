// toogle meuu for the header
function toggleMenu() {
  const header = document.querySelector(".header");
  header.classList.toggle("header-expanded");
}
// Getting elements
const renderAllSongs = document.querySelector("#renderAllSongs");
const selectOptions = document.querySelector("#selectOptions");
const whenSongPlaying = document.querySelector("#whenSongPlaying");
const searchMusic = document.querySelector("#searchMusic");
const whenPlaylistPlaying = document.querySelector("#whenPlaylistPlaying");

// Initialize variables
let songsData = [];
let currentAudio = null; // Track the currently playing audio
let currentIndex = 0; // Track the index of the currently playing song

// Fetch the music data
fetch("./music.json")
  .then((response) => response.json())
  .then((data) => {
    songsData = data;
    displaySongs(songsData);
  })
  .catch((error) => console.error("Error loading music data:", error));

// function for dislplaing the songs
function displaySongs(songs) {
  // empty the innnerHTML of render all songs
  renderAllSongs.innerHTML = "";

  // looping through the songs
  songs.forEach((song, index) => {
    // created music card
    const musicCard = document.createElement("div");
    musicCard.classList.add("music-card");

    // created music title
    const title = document.createElement("h4");
    title.textContent = song.name;
    title.classList.add("music-card-title");

    // created music profile photo
    const profilePhoto = document.createElement("img");
    profilePhoto.src = song.profilePhoto;
    profilePhoto.classList.add("music-card-photo");

    // created music audio
    const musicAudio = document.createElement("audio");
    musicAudio.src = song.src;
    musicAudio.classList.add("music-card-audio");

    // created music slider
    const musicSlider = document.createElement("input");
    musicSlider.type = "range";
    musicSlider.min = 0;
    musicSlider.value = 0;

    // created music icon
    const musicIcon = document.createElement("ion-icon");
    musicIcon.setAttribute("name", "musical-notes-outline");
    musicIcon.classList.add("musicIcon");

    // created music container
    const musicContainer = document.createElement("div");
    musicContainer.classList.add("flex-music");
    musicContainer.append(musicIcon, musicSlider);

    // created volume controll
    const volumeSlider = document.createElement("input");
    volumeSlider.type = "range";
    volumeSlider.min = 0;
    volumeSlider.max = 1;
    volumeSlider.step = 0.01;
    volumeSlider.value = musicAudio.volume;

    // Update the playback slider position as the song plays
    musicAudio.addEventListener("timeupdate", () => {
      musicSlider.max = musicAudio.duration;
      musicSlider.value = musicAudio.currentTime;
    });

    // Seek to a new position when the playback slider is moved
    musicSlider.addEventListener("input", () => {
      musicAudio.currentTime = musicSlider.value;
    });

    // Update volume based on the volume slider's position
    volumeSlider.addEventListener("input", () => {
      musicAudio.volume = volumeSlider.value;
    });

    // created volume icon
    const volumeIcon = document.createElement("ion-icon");
    volumeIcon.setAttribute("name", "volume-high-outline");
    volumeIcon.classList.add("musicIcon");

    // created volume container
    const volumeContainer = document.createElement("div");
    volumeContainer.classList.add("flex-music");
    volumeContainer.append(volumeIcon, volumeSlider);

    // created play button
    const playButton = document.createElement("button");
    playButton.innerHTML = '<ion-icon name="play-outline"></ion-icon>';
    playButton.classList.add("play-button");

    // Skip button
    const skipButton = document.createElement("button");
    skipButton.innerHTML =
      '<ion-icon name="arrow-forward-circle-outline"></ion-icon>';
    skipButton.classList.add("skip-button");

    // Reverse button
    const reverseButton = document.createElement("button");
    reverseButton.innerHTML =
      '<ion-icon name="arrow-back-circle-outline"></ion-icon>';
    reverseButton.classList.add("reverse-button");

    // Handle play button click
    playButton.addEventListener("click", () => {
      currentIndex = index; // Update the current index to the clicked song
      playSelectedSong(musicAudio, song, playButton);
    });

    // Handle skip button click
    skipButton.addEventListener("click", () => {
      skipToNextSong();
    });

    // Handle reverse button click
    reverseButton.addEventListener("click", () => {
      skipToPreviousSong();
    });

    // created first section of the music card
    const firstSection = document.createElement("div");
    firstSection.appendChild(profilePhoto);
    firstSection.classList.add("midsection");

    // created mid section of the music card
    const midSection = document.createElement("div");
    midSection.append(title, volumeContainer, musicContainer);
    midSection.classList.add("midsection");

    // created under last section of the music card
    const underLastSection = document.createElement("div");
    underLastSection.append(reverseButton, skipButton);
    underLastSection.classList.add("flex");

    // created last section of the music card
    const lastSection = document.createElement("div");
    lastSection.append(playButton, underLastSection);
    // lastSection.appendChild(skipButton); // Add skip button here
    lastSection.classList.add("midsection");

    // Append elements to the music card
    musicCard.append(firstSection, midSection, lastSection);
    renderAllSongs.appendChild(musicCard);
  });
}

// Function to play the selected song
function playSelectedSong(musicAudio, song, playButton) {
  if (musicAudio.paused) {
    // Pause the current audio if it's playing and reset its play button
    if (currentAudio && currentAudio !== musicAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      renderAllSongs
        .querySelectorAll(".play-button")
        .forEach(
          (btn) => (btn.innerHTML = '<ion-icon name="play-outline"></ion-icon>')
        );
    }

    // Play the selected song
    musicAudio.play();
    playButton.innerHTML = '<ion-icon name="pause-outline"></ion-icon>';
    currentAudio = musicAudio;

    // Update whenSongPlaying section with current song details
    updateNowPlaying(song);

    // Reset button and whenSongPlaying when audio ends
    musicAudio.onended = () => {
      playButton.innerHTML = '<ion-icon name="play-outline"></ion-icon>';
      currentAudio = null;
      whenSongPlaying.innerHTML = "";
      skipToNextSong(); // Automatically skip to the next song when current ends
    };
  } else {
    // Pause the song and reset the button
    musicAudio.pause();
    playButton.innerHTML = '<ion-icon name="play-outline"></ion-icon>';
    whenSongPlaying.innerHTML = "";
  }
}

// Function to update Now Playing section
function updateNowPlaying(song) {
  // empty the when playing songs and the playlist
  whenSongPlaying.innerHTML = "";
  whenPlaylistPlaying.innerHTML = "";

  // adding classlist of them
  whenSongPlaying.classList.add("music-card-playing");
  whenPlaylistPlaying.classList.add("music-playlist-playing");

  // when the song is playing added playing title
  const playingTitle = document.createElement("h4");
  playingTitle.textContent = `Now Playing: ${song.name}`;
  playingTitle.classList.add("video-description");

  // when the song is playing added playing profile photo
  const playingProfilePhoto = document.createElement("img");
  playingProfilePhoto.src = song.profilePhoto;
  playingProfilePhoto.classList.add("playing-profile-photo");

  // when the song is playing added playing audu description
  const videoDescription = document.createElement("P");
  videoDescription.innerHTML = `<b>Description</b>: ${song.description}`;
  videoDescription.classList.add("video-description");

  // when the song is playing container
  const whenSongPlayingContainer = document.createElement("p");
  whenSongPlayingContainer.append(playingTitle, videoDescription);
  whenSongPlayingContainer.classList.add("when-playing-description");

  // Append the profile photo and title to the whenSongPlaying section
  whenSongPlaying.append(playingProfilePhoto, whenSongPlayingContainer);
  whenPlaylistPlaying.append(renderAllSongs);
}

// Function to skip to the next song
function skipToNextSong() {
  currentIndex = (currentIndex + 1) % songsData.length; // Move to the next song in the list
  const nextSong = songsData[currentIndex];
  const musicAudio = new Audio(nextSong.src);

  // Pause the current audio if it's playing
  if (currentAudio) {
    currentAudio.pause();
  }
  playSelectedSong(
    musicAudio,
    nextSong,
    renderAllSongs.querySelectorAll(".play-button")[currentIndex]
  );
}

// Function to skip to the previous song
function skipToPreviousSong() {
  currentIndex = (currentIndex - 1 + songsData.length) % songsData.length; // Move to the previous song in the list
  const prevSong = songsData[currentIndex];
  const musicAudio = new Audio(prevSong.src);

  // Pause the current audio if it's playing
  if (currentAudio) {
    currentAudio.pause();
  }
  playSelectedSong(
    musicAudio,
    prevSong,
    renderAllSongs.querySelectorAll(".play-button")[currentIndex]
  );
}

// Category filtering
selectOptions.addEventListener("input", () => {
  let selectedCategory = selectOptions.value;
  const filteredSongs =
    selectedCategory === "all"
      ? songsData
      : songsData.filter(
          (song) => song.value.toLowerCase() === selectedCategory.toLowerCase()
        );
  displaySongs(filteredSongs);
});

// Search filtering
searchMusic.addEventListener("input", () => {
  let searchValue = searchMusic.value;
  const filteredSongs = songsData.filter((song) =>
    song.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  displaySongs(filteredSongs);
});
