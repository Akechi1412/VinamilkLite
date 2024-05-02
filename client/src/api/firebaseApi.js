import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../firebase.config';

const firebaseApi = {
  upload: (file, directory) => {
    if (!file) return Promise.reject('No file provided');

    if (!directory) {
      directory = `files/${Date.now()}_${file.name}`;
    }

    const storageRef = ref(storage, directory);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        () => {},
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => {
              resolve(url);
            })
            .catch((error) => {
              reject(error);
            });
        }
      );
    });
  },
};

export default firebaseApi;
