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

      return normalizedItem;
    });
}