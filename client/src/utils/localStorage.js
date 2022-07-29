export const getSavedRxIds = () => {
  const savedRxIds = localStorage.getItem('saved_rx')
    ? JSON.parse(localStorage.getItem('saved_rx'))
    : [];

  return savedRxIds;
};

export const saveRxIds = (bookIdArr) => {
  if (bookIdArr.length) {
    localStorage.setItem('saved_rx', JSON.stringify(bookIdArr));
  } else {
    localStorage.removeItem('saved_rx');
  }
};

export const removeRxId = (bookId) => {
  const savedRxIds = localStorage.getItem('saved_rx')
    ? JSON.parse(localStorage.getItem('saved_rx'))
    : null;

  if (!savedRxIds) {
    return false;
  }

  const updatedSavedRxIds = savedRxIds?.filter((savedRxId) => savedRxId !== bookId);
  localStorage.setItem('saved_rx', JSON.stringify(updatedSavedRxIds));

  return true;
};
