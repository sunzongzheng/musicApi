abstract class Core {
  abstract searchSong(keyword: string): void;
  abstract getSongUrl(keyword: string): void;
}

export default Core;
