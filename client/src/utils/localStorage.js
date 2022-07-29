export const getSavedRxId = () => {
  const savedRxId = localStorage.getItem('saved_rx')
    ? JSON.parse(localStorage.getItem('saved_rx'))
    : [];

  return savedRxId;
};

export const saveRxId = (rxIdArr) => {
  if (rxIdArr.length) {
    localStorage.setItem('saved_rx', JSON.stringify(rxIdArr));
  } else {
    localStorage.removeItem('saved_rx');
  }
};

export const removeRxId = (rxId) => {
  const savedRxId = localStorage.getItem('saved_rx')
    ? JSON.parse(localStorage.getItem('saved_rx'))
    : null;

  if (!savedRxId) {
    return false;
  }

  const updatedSavedRxId = savedRxId?.filter((savedRxId) => savedRxId !== rxId);
  localStorage.setItem('saved_rx', JSON.stringify(updatedSavedRxId));

  return true;
};
