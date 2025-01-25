/**
 * Get the file name from the URL
 * @param url - The URL of the file
 * @param options - The options object
 * @param options.showExtension - Whether to show the file extension
 * @returns The file name
 *
 * Example:
 * - getFileName('https://example.com/path/to/file.jpg') -> file
 * - getFileName('https://example.com/path/to/file.jpg?v=123') -> file
 * - getFileName('https://example.com/path/to/file.jpg?v=123', { showExtension: true }) -> file.jpg
 */
export const getFileName = (
  url: string,
  { showExtension = false }: { showExtension?: boolean } = {}
) => {
  const urlObj = new URL(url);
  const fileName = urlObj.pathname.split('/').pop();
  return showExtension ? fileName : fileName?.split('.').slice(0, -1).join('.');
};
