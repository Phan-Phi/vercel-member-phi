export const transformJSONToFormData = (
  data: Record<string, any>,
  objectKey?: Record<string, any>
) => {
  if (objectKey == undefined) {
    objectKey = data;
  }

  let formData = new FormData();

  for (const key of Object.keys(objectKey)) {
    if (data[key] == null) {
      continue;
    }

    if (Array.isArray(data[key])) {
      for (const el of data[key]) {
        formData.append(key, el);
      }

      continue;
    }
    formData.set(key, data[key]);
  }

  return formData;
};
