const getElementById = (id: string) => document.getElementById(id)!;

const keyBefore = 'vite-react-ts-';

const setLocalStorage = (key: string, value: any): void => {
  value && localStorage.setItem(`${keyBefore}${key}`, typeof value === 'string' ? value : JSON.stringify(value));
};

const getLocalStorage = <T>(key: string, isParse = false): T | string => {
  const cache = localStorage.getItem(`${keyBefore}${key}`) ?? '';
  return isParse ? JSON.parse(cache) : cache;
};

const setSessionStorage = (key: string, value: any): Promise<void> => {
  return new Promise((res) => {
    let timeout: any = null;

    const check = () => {
      if (getSessionStorage(key)) {
        timeout && clearTimeout(timeout);
        res();
      } else {
        timeout && clearTimeout(timeout);
        timeout = setTimeout(check, 250);
      }
    };

    value && sessionStorage.setItem(`${keyBefore}${key}`, typeof value === 'string' ? value : JSON.stringify(value));
    timeout = setTimeout(check, 250);
  });
};

const getSessionStorage = <T>(key: string, isParse = false): T | string => {
  const cache = sessionStorage.getItem(`${keyBefore}${key}`) ?? '';
  return isParse ? JSON.parse(cache) : cache;
};

export { getElementById, setLocalStorage, getLocalStorage, setSessionStorage, getSessionStorage };
