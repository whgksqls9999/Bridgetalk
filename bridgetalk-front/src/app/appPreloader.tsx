import { useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { imageUrls, glbUrls } from '../shared';

export function AppPreloader() {
  const preloadImages = (urls: string[]) => {
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  };

  const preloadGLB = (url: string) => {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        url,
        (gltf) => {
          resolve(gltf);
        },
        undefined,
        (error) => {
          reject(error);
        },
      );
    });
  };

  const preloadGLBs = async (urls: string[]) => {
    const promises = urls.map((url) => preloadGLB(url));
    await Promise.all(promises);
  };

  useEffect(() => {
    const preloadAssets = async () => {
      try {
        preloadImages(imageUrls);
        await preloadGLBs(glbUrls);
      } catch (error) {
        console.error('Failed to preload assets:', error);
      }
    };

    preloadAssets();
  }, []);

  return <></>;
}
