export function normalizeImageField(items, type) {
  return items.map(item => {
    const normalizedItem = { ...item };

    // 이미지 필드 정규화
    if (type === 'popup' && item.imgSavedName) {
        normalizedItem.imageFileName = item.imgSavedName;
      } else if (type === 'concert' && item.fileSavedName) {
        normalizedItem.imageFileName = item.fileSavedName;
      } else if (type === 'musical' && item.fileSavedName) {
        normalizedItem.imageFileName = item.fileSavedName;
      } else if (type === 'exhibition' && item.fileSavedName) {
        normalizedItem.imageFileName = item.fileSavedName;
      }

    // 이미지 필드 정규화
    // if (type === 'exhibition') {
    //   normalizedItem.imageFileName = item.fileSaveName || 'default-image.jpg';
    // } else if (type === 'popup') {
    //   normalizedItem.imageFileName = item.imgSavedName || item.saveImageNames || 'default-image.jpg';
    // } else {
    //   normalizedItem.imageFileName = item.fileSavedName || 'default-image.jpg';
    // }

      return normalizedItem;
    });
}