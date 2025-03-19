import { Share } from 'react-native';
import { getInkverseUrl, InkverseUrlType } from '@/public/utils';

export type ShareItem = {
  type: InkverseUrlType;
  item: any;
  parentItem?: any;
}

export function getMessage({ type, item, parentItem }: ShareItem) {
  switch (type) {
    case 'comicseries':
      return `Hey! Check out ${item.name.trim()} on Inkverse.`
    case 'comicissue':
      return `Hey! Check out this episode from ${parentItem.name.trim()} on Inkverse.`
    case 'creator':
      return `Hey! Check out ${item.name.trim()}'s profile on Inkverse.`
    case 'list':
      return `Hey! Check out this list of webtoons on Inkverse.`
    default:
      throw new Error('Invalid share type');
  }
}

function getTitle({ type, item, parentItem }: ShareItem) {
  switch (type) {
    case 'comicseries':
      return 'Check out this comic!'
    case 'comicissue':
      return 'Check out this episode!'
    case 'creator':
      return 'Check out this profile!'
    case 'list':
      return 'Check out this list of comics!'
    default:
      throw new Error('Invalid share type');
  }
}

function getUrl({ type, item, parentItem }: ShareItem) {
  switch (type) {
    case 'comicseries':
      if (!item) return undefined;
      return getInkverseUrl({ type: 'comicseries', shortUrl: item.shortUrl });
    case 'comicissue':
      if (!parentItem || !item) return undefined;
      return getInkverseUrl({ type: 'comicissue', shortUrl: parentItem.shortUrl, name: item.name, uuid: item.uuid });
    case 'creator':
      if (!item) return undefined;
      return getInkverseUrl({ type: 'creator', shortUrl: item.shortUrl });
    case 'list':
      if (!item) return undefined;
      return getInkverseUrl({ type: 'list', id: item.id, name: item.name });
    default:
      throw new Error('Invalid share type');
  }
}

export async function showShareSheet({ type, item, parentItem }: ShareItem) {
  try {
    const options = {
      url: `https://inkverse.co${getUrl({ type, item, parentItem })}`,
      title: getTitle({ type, item, parentItem }),
      message: getMessage({ type, item, parentItem }),
    }
    await Share.share(options);
  } catch (err) {
    console.log('error', err)
  }
}