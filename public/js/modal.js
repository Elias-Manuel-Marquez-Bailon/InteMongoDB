
const modal = document.getElementById('albumModal');
const modalOverlay = document.getElementById('modalOverlay');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

openModalBtn.addEventListener('click', () => {
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  

}
);

closeModalBtn.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = 'auto';
  resetAlbumForm();}
);

modalOverlay.addEventListener('click', (e) => {
  if (e.target === this.modalOverlay) {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    resetAlbumForm();
    
  }
});

