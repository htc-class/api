// use this file content for `each-yml/handler.ts` in @friends-library/cli to regen *.json
import fs from 'fs';
import { getAllFriends } from '@friends-library/friends';

export default async function handler(): Promise<void> {
  const friends = getAllFriends('en');
  const friendsMap: any = {};
  const docsMap: any = {};

  friends.forEach((f) => {
    const fr: any = f.toJSON();
    fr.documents = f.documents.map((d) => d.id);
    friendsMap[f.id] = fr;
    f.documents.forEach((d) => {
      docsMap[d.id] = {
        friendId: f.id,
        ...d.toJSON(),
        editions: d.editions.map((e) => ({ type: e.type, isbn: e.isbn })),
      };
    });
  });

  const api = '/Users/jared/htc/api/functions';
  fs.writeFileSync(`${api}/friends.json`, JSON.stringify(friendsMap, null, 2));
  fs.writeFileSync(`${api}/documents.json`, JSON.stringify(docsMap, null, 2));
}
