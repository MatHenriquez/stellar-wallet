export default interface ILocalStorage {
  clearStorage(key?: string): void;
  storeItem(key: string, value: string): void;
  getItem(key: string): string | null;
}
